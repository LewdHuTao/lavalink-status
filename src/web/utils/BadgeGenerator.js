async function BadgeGenerator({
  labelBlockColor,
  labelText,
  labelColor,
  valueBlockColor,
  valueText,
  valueColor,
}) {
  const charWidth = 7;
  const textWidth = valueText.length * charWidth;
  const blockWidth = textWidth + 20;

  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${
          blockWidth + 85
        }" height="25" viewBox="0 0 ${blockWidth + 85} 25">
          <rect width="${
            blockWidth + 85
          }" height="25" fill="${labelBlockColor}" rx="5" ry="5"></rect>
          <text x="10" y="17" fill="${labelColor}" font-family="Arial, sans-serif" font-size="13">${labelText}</text>
          <path
            d="M85,0 
               h${blockWidth - 5}  
               q5,0 5,5            
               v15 
               q0,5 -5,5 
               h-${blockWidth - 5} 
               v-25
               z"
            fill="${valueBlockColor}"
          />
          <text x="95" y="17" fill="${valueColor}" font-family="Arial, sans-serif" font-size="13">${valueText}</text>
        </svg>
      `;

  return svg;
}

module.exports = { BadgeGenerator };
