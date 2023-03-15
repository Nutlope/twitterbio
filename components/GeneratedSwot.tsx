import { toast } from "react-hot-toast";

export default function GeneratedSwot(props: any) {
  const {
    generatedSWOT,
    company,
    swotRef,
    strengthsStyle,
    opportunitiesStyle,
    weaknessesStyle,
    threatsStyle,
  } = props;
  const regexSwot = /\b(?:Strengths|Weaknesses|Opportunities|Threats):\s*/g;
  const regexNumbers = /[1-5]/;

  return (
    <div className="space-y-10 my-10">
      {generatedSWOT && (
        <>
          <div>
            <h2
              className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
              ref={swotRef}
            >
              SWOT analysis of {company}
            </h2>
          </div>
          <div className="grid grid-rows-4 md:grid-rows-2 grid-flow-col gap-4 mx-auto">
            {!generatedSWOT.includes("general SWOT") &&
              generatedSWOT
                .split(regexSwot)
                .filter((section: any) => section.trim() !== "")
                .map((swot: string, index: number) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      style={
                        swot[0] != "1"
                          ? threatsStyle
                          : index == 0
                          ? strengthsStyle
                          : index == 1
                          ? weaknessesStyle
                          : index == 2
                          ? opportunitiesStyle
                          : threatsStyle
                      }
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `SWOT analysis of ${company}\n\n${generatedSWOT}`
                        );
                        toast("SWOT copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                      key={swot}
                    >
                      <h2
                        className="font-bold text-center"
                        key={"title" + index}
                      >
                        {swot[0] != "1"
                          ? "Invalid company"
                          : index == 0
                          ? "Strengths"
                          : index == 1
                          ? "Weaknessess"
                          : index == 2
                          ? "Opportunities"
                          : "Threats"}
                      </h2>
                      {swot
                        .split(regexNumbers)
                        .filter((section: any) => section.trim() !== "")
                        .map((s: string, index: number) => (
                          <p className="p-1" key={index + 1}>
                            {s[0] == "." ? index + 1 : ""}
                            {s}
                          </p>
                        ))}
                    </div>
                  );
                })}
          </div>
        </>
      )}
    </div>
  );
}
