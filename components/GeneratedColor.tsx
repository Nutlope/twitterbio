import { toast } from "react-hot-toast";

export default function GeneratedColor(props: any) {
  const {
    generatedColor,
    company,
    color,
    swotRef,
    strengthsStyle,
    opportunitiesStyle,
    weaknessesStyle,
    threatsStyle,
  } = props;

  const regexSwot = /\b(?:Strengths|Weaknesses|Opportunities|Threats):\s*/g;

  return (
    <div className="space-y-10 my-10">
      {generatedColor && (
        <>
          <div>
            <h2
              className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
              ref={swotRef}
            >
              Some color on {color}
            </h2>
          </div>
          <div className="grid grid-rows-4 md:grid-rows-2 grid-flow-col gap-4 mx-auto">
            {generatedColor.split(regexSwot).map((c: string, index: number) => {
              return (
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                  style={
                    color === "Strengths"
                      ? strengthsStyle
                      : color === "Weaknessess"
                      ? weaknessesStyle
                      : color === "Opportunities"
                      ? opportunitiesStyle
                      : threatsStyle
                  }
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Some color on ${company} ${color}\n\n${generatedColor}`
                    );
                    toast("Color copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                  key={c}
                >
                  <h2 className="font-bold text-center" key={"title" + index}>
                    {color}
                  </h2>
                  <p className="p-1" key={"color"}>
                    {c}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
