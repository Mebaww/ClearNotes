## Summary

<!-- Provide a clear, concise summary of what this pull request introduces, fixes, or enhances. Include motivation and context. -->

## Related Issues

<!-- Link to related issue(s). Example: Closes #123 or Fixes #456 -->
Closes #

## Type of Change

<!-- Please check all that apply: -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 🎨 UI / UX improvement (visual or interaction enhancement)
- [ ] ⚡ Performance optimization
- [ ] ♻️ Refactoring / Code cleanup (no behavior change)
- [ ] 📝 Documentation update
- [ ] ⚠️ Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Visual Changes (Screenshots / Screen Recordings)

<!-- If this PR introduces UI/UX changes, please attach before and after screenshots or a short recording. -->
| Before | After |
| :---: | :---: |
| _None / Old UI_ | _New UI_ |

## How Has This Been Tested?

<!-- Describe the manual or automated tests you ran to verify your changes. Include reproduction steps if applicable. -->
1. 
2. 
3. 

## Contributor Pre-Flight Checklist

Before requesting a review, please confirm:

- [ ] My code adheres to the project's [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guide](CONTRIBUTING.md).
- [ ] I have verified that `npx tsc --noEmit` passes without TypeScript errors.
- [ ] I have verified that `npm run lint` passes without ESLint errors or warnings.
- [ ] I have verified that `npm run build` builds successfully.
- [ ] UI components are responsive (tested on mobile and desktop viewports) and support both dark and light modes.
- [ ] I have not committed any `.env` files, API keys, or sensitive credentials.
- [ ] Relevant documentation has been updated if needed.

## Maintainer Review Checklist

<!-- For repo maintainer during PR review -->
- [ ] Automated CI checks passed.
- [ ] Architecture and code quality align with ClearNotes patterns.
- [ ] Safe database / API / Auth handling (no data leak or authorization bypass).
- [ ] Ready to merge.
