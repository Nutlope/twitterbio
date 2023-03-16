import LoadingDots from "./LoadingDots";

export default function GenerateColor(props: any) {
  const {
    generatedSWOT,
    loading,
    loadingColor,
    color,
    swotRef,
    strengthsStyle,
    weaknessesStyle,
    opportunitiesStyle,
    threatsStyle,
    generateColor,
  } = props;

  return (
    <div className="space-y-10 my-10">
      {generatedSWOT && !loading && !generatedSWOT.includes("SWOT") && (
        <>
          <div>
            <h2
              className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
              ref={swotRef}
            >
              Click for more color
            </h2>
          </div>
          <div className="grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-4 mx-auto">
            {["Strengths", "Weaknessess", "Opportunities", "Threats"].map(
              (c, index) => {
                return (
                  <div
                    style={
                      index == 0
                        ? strengthsStyle
                        : index == 1
                        ? weaknessesStyle
                        : index == 2
                        ? opportunitiesStyle
                        : threatsStyle
                    }
                    className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border text-left"
                    onClick={(e) => generateColor(e, c)}
                  >
                    <h2 className="font-bold text-center">{c}</h2>
                    {loadingColor && color === c && (
                      <LoadingDots color="black" style="large" />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
}
