import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const MainPanel: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [params, _] = useSearchParams();
  const previewParam = params.get("preview");

  const [leftPosition, setLeftPosition] = useState("left-full");

  useEffect(() => {
    if (previewParam) {
      setLeftPosition("left-0");
    } else {
      setLeftPosition("left-full");
    }
  }, [previewParam]);

  return (
    <main
      className={`absolute ${leftPosition} top-0 w-full md:static md:flex-1 h-screen bg-dark-100 overflow-hidden transition-all ease-out duration-300`}
    >
      {children}
    </main>
  );
};

export const EmptyContent: React.FC<{}> = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        width="240px"
        height="240px"
        viewBox="0 0 240 240"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path
            d="M120,0 C186.27417,0 240,53.72583 240,120 C240,186.27417 186.27417,240 120,240 C53.72583,240 0,186.27417 0,120 C0,53.72583 53.72583,0 120,0 Z M120,13 C60.9055318,13 13,60.9055318 13,120 C13,179.094468 60.9055318,227 120,227 C179.094468,227 227,179.094468 227,120 C227,60.9055318 179.094468,13 120,13 Z M136.05297,52.0130736 L143.981768,78.9902042 L171.324866,72.3636109 C176.85783,71.0223745 182.693566,72.5850032 186.814183,76.5111684 L187.342313,77.0368846 C193.51056,83.4523767 193.581785,93.647008 187.377836,100.149463 L167.961923,120.497105 L187.377836,140.850537 C191.306645,144.968382 192.870325,150.800192 191.528186,156.329433 L191.31144,157.135565 C188.801812,165.630025 180.032505,170.747193 171.324866,168.636389 L143.980155,162.006901 L136.05297,188.986926 C134.448815,194.446008 130.17676,198.715189 124.714003,200.318264 L123.994348,200.512473 C115.350504,202.642991 106.480138,197.607316 103.94703,188.986926 L96.0194775,162.00515 L68.6751339,168.636389 C63.1421703,169.977625 57.3064343,168.414997 53.185817,164.488832 L52.6576868,163.963115 C46.4894401,157.547623 46.418215,147.352992 52.6221641,140.850537 L72.0393225,120.498248 L52.6221641,100.149463 C48.6933555,96.0316178 47.1296747,90.1998082 48.4718142,84.6705673 C50.6500466,75.6968561 59.6953809,70.1868441 68.6751339,72.3636109 L96.0210909,78.9884525 L103.94703,52.0130736 C105.551185,46.5539923 109.82324,42.2848113 115.285997,40.6817357 L116.005652,40.4875274 C124.649496,38.3570092 133.519862,43.3926836 136.05297,52.0130736 Z M119.12195,53.7358239 C118.104435,54.0344194 117.308704,54.8296147 117.009907,55.8464458 L108.414641,85.096897 C106.740805,90.7931103 100.885355,94.1714814 95.1120502,92.7719842 L65.4657282,85.585469 C63.7931222,85.1800154 62.1083008,86.2063331 61.7025742,87.8778136 C61.4525818,88.9077129 61.7438394,89.9939699 62.4756356,90.7609768 L83.5266916,112.824913 C87.6261601,117.121629 87.6261601,123.878371 83.5266916,128.175087 L62.4756356,150.239023 C61.2879631,151.483841 61.3349679,153.455116 62.5806239,154.64199 C63.3481471,155.373294 64.4351355,155.664355 65.4657282,155.414531 L95.1120502,148.228016 C100.885355,146.828519 106.740805,150.20689 108.414641,155.903103 L117.009907,185.153554 C117.494841,186.803826 119.226667,187.748783 120.87805,187.264176 C121.895565,186.965581 122.691296,186.170385 122.990093,185.153554 L131.585359,155.903103 C133.259195,150.20689 139.114645,146.828519 144.88795,148.228016 L174.534272,155.414531 C176.206878,155.819985 177.891699,154.793667 178.297426,153.122186 C178.547418,152.092287 178.256161,151.00603 177.524364,150.239023 L156.473308,128.175087 C152.37384,123.878371 152.37384,117.121629 156.473308,112.824913 L177.524364,90.7609768 C178.712037,89.5161589 178.665032,87.5448837 177.419376,86.3580102 C176.651853,85.6267065 175.564865,85.3356448 174.534272,85.585469 L144.88795,92.7719842 C139.114645,94.1714814 133.259195,90.7931103 131.585359,85.096897 L122.990093,55.8464458 C122.505159,54.1961743 120.773333,53.2512167 119.12195,53.7358239 Z"
            fill="rgba(255,255,255,0.05)"
          ></path>
        </g>
      </svg>
    </div>
  );
};
