import { option } from "fp-ts";
import * as A from "fp-ts/Array";
import { constant, flow, FunctionN, pipe } from "fp-ts/lib/function";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";

type TreeN = Map<string, TreeN>;

const toPath = (input: string): Array<string> => input.split("/");

const addItem = (tree: TreeN, [key, ...rest]: Array<string>): TreeN => {
  let keyItem = tree.get(key);
  if (keyItem === undefined) {
    keyItem = tree.set(key, new Map<string, TreeN>());
  }

  if (Boolean(rest.length)) {
    tree.set(key, addItem(keyItem, rest));
  }

  return tree;
};

export type Node = {
  type: "folder" | "page";
  name: string;
  items?: Array<Node>;
};

const toNode = ([key, tree]: [string, TreeN]): Node => ({
  name: key,
  type: [...tree.keys()].length > 0 ? "folder" : "page",
  items: [...tree.entries()].reduce(
    (acc, cur) => [...acc, toNode(cur)],
    new Array<Node>()
  )
});

export const getTree = (arr: Array<string>): Array<Node> =>
  [...arr.map(toPath).reduce(addItem, new Map<string, TreeN>())].reduce(
    (acc, cur) => [...acc, toNode(cur)],
    new Array<Node>()
  );

type Branch = { type: string; name: string; items?: Branch[] };
type Treee = Branch[];

const DIVIDER = "/";
export const buildTree = (pageParts: string[]): Treee => {
  return pipe(
    pageParts,
    NEA.groupBy((part) => part.split(DIVIDER)[0]),
    R.mapWithIndex((group, items) => {
      return pipe(
        items,
        O.fromPredicate((items) => items.length > 1),
        O.map((items) =>
          items.map((item) => item.replace(group + DIVIDER, ""))
        ),
        O.map((items) => ({
          type: "folder",
          name: group,
          items: buildTree(items)
        })),
        O.alt(() =>
          O.some({
            type: "page",
            name: group,
            items: new Array<Branch>()
          })
        )
      );
    }),
    R.toArray,
    A.reverse,
    A.filterMap(([, item]) => item)
  );
};

export const transformHierarchy: FunctionN<[Array<string>], Array<Node>> = flow(
  // ["Page1", "articles/Article", "articles/Article2"]
  // Step 1: split into parts
  A.map((item: string) => item.split("/")),
  // [["Page1"], ["articles", "Article"], ["articles", "Article2"]]
  // Step 2: chop (group) by 1st item in each array
  A.chop((arrayToChop) => {
    const { init, rest } = pipe(
      arrayToChop,
      A.spanLeft((parts) => parts[0] === arrayToChop[0][0]) // makes sure "articles" is the same
    );
    return [init, rest];
  }),
  // [[["Page1"]], [["articles", "Article"], ["articles", "Article2"]]]
  A.map((groupedItems) => {
    // Step 3: anything chopped with single item - is a single page
    // [["Page1"]]
    if (groupedItems.length === 1 && groupedItems[0].length === 1) {
      return {
        type: "page",
        name: groupedItems[0][0]
      };
    }
    // Step 4: everything else is a folder
    // [["articles", "Article"], ["articles", "Article2"]]
    return {
      type: "folder",
      name: groupedItems[0][0],
      items: transformHierarchy(groupedItems.map((aa) => aa.slice(1).join("/"))) // recursively apply same algorithm
    };
  })
);

export const get = <T, K extends keyof T>(key: K) => (item: T) => item[key];

export const referenceEqualy = <T>(first: T, second: T) => first === second;

/**
 * Curried reference equilier
 */
export const refEqCurry = <T>(first: T) => (second: T) =>
  referenceEqualy(first, second);

const toChain: FunctionN<[Array<string>], option.Option<Node>> = flow(
  A.reverse,
  NEA.fromArray,
  O.map(([last, ...rest]) =>
    rest.reduce((acc, cur) => ({ type: "folder", name: cur, items: [acc] }), {
      type: "page",
      name: last
    } as Node)
  )
);

export const merge = (arr: Array<Node>, node: Node): Array<Node> => {
  //   const result = pipe(
  //     tree,
  //     get('items'),
  //     O.fromNullable,
  //     O.chain(A.findFirst(flow(get('name'), refEqCurry(chain.name)))),
  // O.map(_ => _)
  //   )
  const nodeToUpdate = arr.find((_) => _.name === node.name);
  if (nodeToUpdate === undefined) {
    return [...arr, node];
  } else {
    return (
      arr.map((_) =>
        _.name === node.name
          ? {
              name: node.name,
              type:
                Boolean(node.items?.length) || Boolean(_.items?.length)
                  ? "folder"
                  : "page",
              items: node.items?.reduce(
                (acc, cur) => merge(acc, cur),
                _.items ?? []
              )
            }
          : _
      ) ?? []
    );
  }
};

export const toTree: FunctionN<[Array<string>], Array<Node>> = flow(
  A.map(toPath),
  A.map(toChain),
  A.filter(O.isSome),
  A.map(get("value")),
  A.reduce([], merge),
  O.fromNullable,
  O.getOrElse(constant(new Array<Node>()))
);
