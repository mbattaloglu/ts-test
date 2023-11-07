import { buildTree, getTree, merge, toTree, transformHierarchy } from "../tree";

describe("getTree", () => {
  it("should merge to treess", () => {
    expect(
      merge(
        [
          {
            name: "some",
            type: "folder",
            items: [{ name: "level0_0", type: "page" }]
          }
        ],
        {
          name: "some",
          type: "folder",
          items: [{ name: "level0_1", type: "page" }]
        }
      )
    ).toEqual([
      {
        name: "some",
        type: "folder",
        items: [
          { name: "level0_0", type: "page" },
          { name: "level0_1", type: "page" }
        ]
      }
    ]);
  });

  it("should handle root level only", () => {
    const arr = ["p", "a"];
    expect(toTree(arr)).toEqual([
      { name: "p", type: "page" },
      { name: "a", type: "page" }
    ]);
  });

  it("should handle second level", () => {
    const arr = ["p", "a/d", "a/d/b"];
    expect(toTree(arr)).toEqual([
      { name: "p", type: "page" },
      {
        name: "a",
        type: "folder",
        items: [
          { name: "d", type: "folder", items: [{ name: "b", type: "page" }] }
        ]
      }
    ]);
  });
});

// describe("buildTree", () => {
//   it("should handle root level only", () => {
//     const arr = ["p", "a"];
//     expect(buildTree(arr)).toEqual([
//       { name: "p", type: "page", items: [] },
//       { name: "a", type: "page", items: [] }
//     ]);
//   });

//   xit("should handle second level", () => {
//     const arr = ["p", "a", "a/d"];
//     expect(buildTree(arr)).toEqual([
//       { name: "p", type: "page", items: [] },
//       {
//         name: "a",
//         type: "folder",
//         items: [{ name: "d", type: "page", items: [] }]
//       }
//     ]);
//   });
// });

// xdescribe("transformHierarchy", () => {
//   it("should handle root level only", () => {
//     const arr = ["p", "a"];
//     expect(transformHierarchy(arr)).toEqual([
//       { name: "p", type: "page" },
//       { name: "a", type: "page" }
//     ]);
//   });

//   it("should handle second level", () => {
//     const arr = ["p", "a/r", "a/d"];
//     expect(transformHierarchy(arr)).toEqual([
//       { name: "p", type: "page" },
//       {
//         name: "a",
//         type: "folder",
//         items: [
//           { name: "r", type: "page" },
//           { name: "d", type: "page" }
//         ]
//       }
//     ]);
//   });

//   it("should handle second level", () => {
//     const arr = ["p", "a", "a/d"];
//     expect(transformHierarchy(arr)).toEqual([
//       { name: "p", type: "page" },
//       {
//         name: "a",
//         type: "folder",
//         items: [{ name: "d", type: "page" }]
//       }
//     ]);
//   });

//   it("should handle mutli level", () => {
//     const arr = ["p", "a/d", "d/a/b"];
//     expect(transformHierarchy(arr)).toEqual([
//       { name: "p", type: "page" },
//       {
//         name: "a",
//         type: "folder",
//         items: [{ name: "d", type: "page" }]
//       },
//       {
//         name: "d",
//         type: "folder",
//         items: [
//           {
//             name: "a",
//             type: "folder",
//             items: [{ name: "b", type: "page" }]
//           }
//         ]
//       }
//     ]);
//   });
// });
