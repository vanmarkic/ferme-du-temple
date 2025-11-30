# Visual Regression Tests

This directory contains Playwright visual regression tests for the Ferme du Temple project.

## Running Tests

### First Time Setup
Generate baseline screenshots:
```bash
npx playwright test --update-snapshots
```

### Running Tests
Run visual regression tests:
```bash
npx playwright test
```

### View Test Report
```bash
npx playwright show-report
```

## Test Coverage

The tests capture screenshots at three breakpoints:
- **Mobile**: iPhone 12 (390x844)
- **Tablet**: iPad Pro (1024x1366)
- **Desktop**: Desktop Chrome (1280x720)

### Sections Tested
1. Hero Section - Bauhaus grid layout with images
2. Project Section - Project description
3. Collaboration Section - Community collaboration details
4. Location Section - Map and location info
5. Pricing Section - Pricing details
6. Inscription Form - Registration form
7. Timeline Section - Project timeline
8. Footer - Contact and links

## Baseline Screenshots

Baseline screenshots are stored in:
- `tests/visual-regression.spec.ts-snapshots/`

Each screenshot is named with the format:
`{test-name}-{browser}-{viewport}.png`

## Updating Baselines

If intentional design changes are made, update baselines:
```bash
npx playwright test --update-snapshots
```

## Troubleshooting

- **Flaky tests**: Increase `maxDiffPixels` in test config
- **Missing images**: Check that all assets load before screenshot
- **Font rendering**: May vary across systems; consider using webfonts
