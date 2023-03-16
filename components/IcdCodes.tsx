

export default function IcdCodes(props: { codeArray: string [] }) {

    const codeDescriptions: {[key: string]: string} = require("../codemCodes.json");
    const newCodeArray = props.codeArray.filter(code => code in codeDescriptions);

    return (
      <div className="right-textbox">
        <div className="right-title">Suggested Codes</div>
        <div className="left-text">
        {newCodeArray
          .map((code, index) => { 
            return (
              <div className="code-boxes" >
                <span className="code-font">
                  {index + 1}. {code}
                </span>
                <div className="code-description">
                  {codeDescriptions[code]} 
                </div>
              </div>
            ); 
          })}        
            </div>
      </div>
    );
  }

// import fsPromises from 'fs/promises';
// import path from 'path'
// export async function getStaticProps() {
//   const filePath = path.join(process.cwd(), 'data.json');
//   const jsonData = await fsPromises.readFile(filePath);
//   const objectData = JSON.parse(jsonData);
//   return {
//     props: objectData
//   }
// }
  