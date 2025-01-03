# Image Assets Organization

This directory contains all image assets for the Ambient Gaza website, organized as follows:

## Directory Structure

- `/og/` - Open Graph images for social media sharing
- `/icons/` - Icons and UI elements
- `/photos/` - Project photos and visual content

## Optimization Guidelines

### All Images
- Use modern formats (WebP with JPEG/PNG fallback)
- Implement responsive images using srcset
- Lazy load images below the fold
- Compress all images before deployment

### Size Guidelines

1. **Photos**
   - Max width: 1600px
   - Format: WebP (with JPEG fallback)
   - Quality: 80-85%
   - File size: < 200KB

2. **Icons**
   - Format: SVG preferred
   - PNG fallback: 2x size for retina
   - Optimize SVGs using SVGO

3. **Thumbnails**
   - Width: 300-400px
   - Format: WebP
   - Quality: 75-80%
   - File size: < 50KB

## Implementation Notes

- Use `<picture>` element for WebP with fallbacks
- Implement lazy loading using `loading="lazy"`
- Include appropriate alt text for accessibility
- Consider dark mode variants where needed 