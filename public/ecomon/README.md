# EcoMon Images

Place your Pokemon-style images here for your EcoMons.

## Suggested File Structure

```
public/ecomon/
├── leaf/
│   ├── stage-1.png    # Seed stage
│   ├── stage-2.png    # Sprout stage
│   ├── stage-3.png    # Sapling stage
│   ├── stage-4.png    # Guardian stage
│   └── stage-5.png    # Ancient stage
├── water/
│   ├── stage-1.png
│   ├── stage-2.png
│   ├── stage-3.png
│   ├── stage-4.png
│   └── stage-5.png
├── fire/
│   ├── stage-1.png
│   ├── stage-2.png
│   ├── stage-3.png
│   ├── stage-4.png
│   └── stage-5.png
├── earth/
│   └── ...
├── air/
│   └── ...
└── placeholder.png    # Default fallback image
```

## Image Specifications

- **Format**: PNG with transparency (recommended)
- **Size**: 256x256 or 512x512 pixels
- **Style**: Pokemon-style pixel art or modern illustration

## Usage in Code

The `EcoMonDisplay` component will look for images at:
```
/ecomon/{species}/stage-{evolutionStage}.png
```

Falls back to `/ecomon/placeholder.png` if not found.
