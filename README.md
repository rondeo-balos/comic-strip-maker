# Comic Strip Maker API

A flexible API to generate comic strips from JSON payloads with images. Uses HTML/CSS for rendering and outputs high-quality PNG images.

## Features

- ✨ Dynamic grid-based layout (1 or 2 panels per row)
- 🗨️ Speech and thought bubbles
- 📝 Narration sections
- 🎨 Customizable panel borders and styling
- 📐 Flexible panel sizing
- 🖼️ High-quality image output

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The API will run on `http://localhost:3000` by default.

## API Endpoint

### POST `/api/generate`

Generates a comic strip from JSON payload.

**Request Body:**

```json
{
  "title": "My Comic Strip",
  "width": 1200,
  "height": "auto",
  "backgroundColor": "#f0f0f0",
  "rows": [
    {
      "columns": 2,
      "panels": [
        {
          "image": "data:image/jpeg;base64,...",
          "imagePosition": "center",
          "imageSize": "cover",
          "borderStyle": "solid",
          "borderColor": "#000000",
          "borderWidth": "4px",
          "backgroundColor": "#ffffff",
          "dialogBubbles": [
            {
              "text": "Hello, world!",
              "position": { "top": "20%", "left": "50%" },
              "type": "speech",
              "fontSize": "16px",
              "maxWidth": "200px"
            }
          ],
          "narration": {
            "text": "Meanwhile, in the city...",
            "backgroundColor": "#ffffcc",
            "fontSize": "14px",
            "padding": "10px"
          }
        },
        {
          "image": "data:image/jpeg;base64,...",
          "dialogBubbles": [
            {
              "text": "I'm thinking...",
              "position": { "top": "30%", "left": "60%" },
              "type": "thought"
            }
          ]
        }
      ]
    },
    {
      "columns": 1,
      "panels": [
        {
          "image": "data:image/jpeg;base64,...",
          "borderWidth": "5px"
        }
      ]
    }
  ]
}
```

**Response:**

- Content-Type: `image/png`
- Body: PNG image buffer

## JSON Schema

### Root Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | No | - | Comic strip title |
| `width` | number | No | 1200 | Output width in pixels |
| `height` | number/string | No | "auto" | Output height ("auto" or number) |
| `backgroundColor` | string | No | "#ffffff" | Background color |
| `rows` | array | Yes | - | Array of row objects |

### Row Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `columns` | number | No | 2 | Number of columns (1 or 2) |
| `panels` | array | Yes | - | Array of panel objects |

### Panel Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `image` | string | Yes | - | Image URL or base64 data URI |
| `imagePosition` | string | No | "center" | CSS background-position |
| `imageSize` | string | No | "cover" | CSS background-size |
| `borderStyle` | string | No | "solid" | CSS border-style |
| `borderColor` | string | No | "#000000" | Border color |
| `borderWidth` | string | No | "4px" | Border width |
| `backgroundColor` | string | No | "#ffffff" | Panel background |
| `dialogBubbles` | array | No | [] | Array of dialog bubble objects |
| `narration` | object | No | - | Narration box object |

### Dialog Bubble Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text` | string | Yes | - | Bubble text content |
| `position` | object | No | {top:"10%",left:"10%"} | Position with `top` and `left` |
| `type` | string | No | "speech" | "speech" or "thought" |
| `fontSize` | string | No | "14px" | Font size |
| `maxWidth` | string | No | "200px" | Maximum bubble width |

### Narration Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text` | string | Yes | - | Narration text |
| `backgroundColor` | string | No | "#ffffcc" | Background color |
| `fontSize` | string | No | "12px" | Font size |
| `padding` | string | No | "8px 12px" | Padding |

## Example Request

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d @example-payload.json \
  --output comic.png
```

## Example with Base64 Images

```json
{
  "title": "Adventure Time",
  "rows": [
    {
      "columns": 2,
      "panels": [
        {
          "image": "https://example.com/image1.jpg",
          "dialogBubbles": [
            {
              "text": "Look at that!",
              "position": { "top": "15%", "left": "20%" },
              "type": "speech"
            }
          ]
        },
        {
          "image": "https://example.com/image2.jpg",
          "dialogBubbles": [
            {
              "text": "Hmm...",
              "position": { "top": "25%", "left": "70%" },
              "type": "thought"
            }
          ]
        }
      ]
    },
    {
      "columns": 1,
      "panels": [
        {
          "image": "https://example.com/image3.jpg",
          "narration": {
            "text": "And so the adventure continues..."
          }
        }
      ]
    }
  ]
}
```

## License

ISC
