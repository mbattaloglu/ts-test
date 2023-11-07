import { extractHighlight } from "../highlight";

describe("extractHighlight test suit", () => {
  it("should work with hardcode implementation", () => {
    expect(extractHighlight("ar", "ar")).toEqual([
      {
        text: "ar",
        isHighlighted: true
      }
    ]);
  });
  it("should simple split", () => {
    expect(extractHighlight("car", "ar")).toEqual([
      {
        text: "c",
        isHighlighted: false
      },
      {
        text: "ar",
        isHighlighted: true
      }
    ]);
  });
  it("should split from start", () => {
    expect(extractHighlight("archer", "ar")).toEqual([
      {
        text: "ar",
        isHighlighted: true
      },
      {
        text: "cher",
        isHighlighted: false
      }
    ]);
  });
  it("should split in the middle", () => {
    expect(extractHighlight("carpool", "ar")).toEqual([
      {
        text: "c",
        isHighlighted: false
      },
      {
        text: "ar",
        isHighlighted: true
      },
      {
        text: "pool",
        isHighlighted: false
      }
    ]);
  });
  it("should handle empty input string", () => {
    expect(extractHighlight("", "something")).toEqual([]);
  });
  it("should handle multiple highlights", () => {
    expect(extractHighlight("carpoolarch", "ar")).toEqual([
      {
        text: "c",
        isHighlighted: false
      },
      {
        text: "ar",
        isHighlighted: true
      },
      {
        text: "pool",
        isHighlighted: false
      },
      {
        text: "ar",
        isHighlighted: true
      },
      {
        text: "ch",
        isHighlighted: false
      }
    ]);
  });
  it("should keep original case", () => {
    expect(extractHighlight("cArpOOlArch", "ar")).toEqual([
      {
        text: "c",
        isHighlighted: false
      },
      {
        text: "Ar",
        isHighlighted: true
      },
      {
        text: "pOOl",
        isHighlighted: false
      },
      {
        text: "Ar",
        isHighlighted: true
      },
      {
        text: "ch",
        isHighlighted: false
      }
    ]);
  });
  it("should handle undefined substring", () => {
    expect(extractHighlight("carpoolArch", undefined)).toEqual([
      {
        text: "carpoolArch",
        isHighlighted: false
      }
    ]);
  });
  it("should handle empty substring", () => {
    expect(extractHighlight("carpoolArch", "")).toEqual([
      {
        text: "carpoolArch",
        isHighlighted: false
      }
    ]);
  });

  it("should combine sequencial match", () => {
    expect(extractHighlight("gOoOoOogles", "o")).toEqual([
      {
        text: "g",
        isHighlighted: false
      },
      {
        text: "OoOoOo",
        isHighlighted: true
      },
      {
        text: "gles",
        isHighlighted: false
      }
    ]);
  });
  it("no substring in the text", () => {
    expect(extractHighlight("carcarcar", "yup")).toEqual([{
      text:"carcarcar",
      isHighlighted: false
    }])
  })
});
