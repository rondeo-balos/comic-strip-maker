export function generateHTML(comicData) {
  const { rows, title, backgroundColor = '#ffffff' } = comicData;

  const rowsHTML = rows.map((row, rowIndex) => {
    const columns = row.columns || 1;
    const panels = row.panels || [];
    
    const gridTemplateColumns = columns === 1 ? '1fr' : '1fr 1fr';
    
    const panelsHTML = panels.map((panel, panelIndex) => {
      const {
        image,
        imagePosition = 'center',
        imageSize = 'cover',
        dialogBubbles = [],
        narration,
        borderStyle = 'solid',
        borderColor = '#000000',
        borderWidth = '4px',
        backgroundColor = '#ffffff'
      } = panel;

      // Build dialog bubbles HTML
      const bubblesHTML = dialogBubbles.map((bubble, bubbleIndex) => {
        const {
          text,
          position = { top: '10%', left: '10%' },
          type = 'speech', // 'speech' or 'thought'
          fontSize = '14px',
          width = 'auto',
          maxWidth = '200px'
        } = bubble;

        const bubbleClass = type === 'thought' ? 'thought-bubble' : 'speech-bubble';
        
        return `
          <div class="${bubbleClass}" style="
            top: ${position.top};
            left: ${position.left};
            font-size: ${fontSize};
            width: ${width};
            max-width: ${maxWidth};
          ">
            ${text}
          </div>
        `;
      }).join('');

      // Build narration HTML
      const narrationHTML = narration ? `
        <div class="narration" style="
          background: ${narration.backgroundColor || '#ffffcc'};
          font-size: ${narration.fontSize || '12px'};
          padding: ${narration.padding || '8px 12px'};
        ">
          ${narration.text}
        </div>
      ` : '';

      return `
        <div class="panel" style="
          border: ${borderWidth} ${borderStyle} ${borderColor};
          background-color: ${backgroundColor};
        ">
          <div class="panel-image" style="
            background-image: url('${image}');
            background-position: ${imagePosition};
            background-size: ${imageSize};
          "></div>
          ${bubblesHTML}
          ${narrationHTML}
        </div>
      `;
    }).join('');

    return `
      <div class="row" style="
        grid-template-columns: ${gridTemplateColumns};
        gap: 10px;
      ">
        ${panelsHTML}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Comic Strip'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
          background-color: ${backgroundColor};
          padding: 20px;
        }

        .comic-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .title {
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .row {
          display: grid;
        }

        .panel {
          position: relative;
          background-color: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          aspect-ratio: 4/3;
        }

        .panel-image {
          flex: 1;
          background-repeat: no-repeat;
          width: 100%;
          height: 100%;
        }

        .speech-bubble {
          position: absolute;
          background: white;
          border: 2px solid black;
          border-radius: 20px;
          padding: 10px 15px;
          max-width: 200px;
          word-wrap: break-word;
          z-index: 10;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
        }

        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          border-bottom: none;
        }

        .speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -13px;
          left: 19px;
          width: 0;
          height: 0;
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          border-top: 11px solid black;
          border-bottom: none;
        }

        .thought-bubble {
          position: absolute;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
          padding: 15px;
          max-width: 180px;
          word-wrap: break-word;
          z-index: 10;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .thought-bubble::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 15px;
          width: 15px;
          height: 15px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
        }

        .thought-bubble::before {
          content: '';
          position: absolute;
          bottom: -35px;
          left: 10px;
          width: 8px;
          height: 8px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
        }

        .narration {
          background: #ffffcc;
          border: 2px solid black;
          padding: 8px 12px;
          font-style: italic;
          font-size: 12px;
          text-align: center;
          margin: 0;
          z-index: 5;
        }
      </style>
    </head>
    <body>
      <div class="comic-container">
        ${title ? `<div class="title">${title}</div>` : ''}
        ${rowsHTML}
      </div>
    </body>
    </html>
  `;
}
