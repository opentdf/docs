# Contributing to OpenTDF Documentation

> Thank you for your interest in improving OpenTDF documentation! This guide will help you contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Development Setup](#development-setup)
- [Writing Guidelines](#writing-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Review Process](#review-process)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Before You Begin

1. **Check existing issues**: Look for [open documentation issues](https://github.com/opentdf/docs/issues) to see if someone's already working on what you want to improve
2. **Read our style guide**: Familiarize yourself with our [Style Guide](STYLE_GUIDE.md)
3. **Understand our structure**: Review how we organize content into four categories:
   - 🚀 **Tutorials**: Learning-oriented, hands-on guides
   - 📖 **How-To Guides**: Problem-solving, task-oriented instructions
   - 💡 **Explanations**: Understanding-oriented, conceptual content
   - 📚 **Reference**: Information-oriented, lookup material

### What Makes a Good Contribution

- **User-focused**: Addresses real user needs and pain points
- **Tested**: All instructions and code examples actually work
- **Clear**: Written in plain language appropriate for the audience
- **Complete**: Includes necessary context, prerequisites, and next steps
- **Consistent**: Follows our established style and formatting standards

## Types of Contributions

### 📝 Content Contributions

**New Content:**

- Tutorials for common use cases
- How-to guides for specific problems
- Explanations of complex concepts
- Missing reference documentation

**Content Improvements:**

- Fix outdated information
- Add missing steps or context
- Improve clarity and organization
- Add examples and code samples

**Structure Improvements:**

- Better organization within sections
- Improved navigation between related topics
- Cross-references and internal links

### 🐛 Fixes and Updates

**Quick Fixes:**

- Typos and grammar errors
- Broken links
- Outdated screenshots
- Missing or incorrect code

**Larger Updates:**

- Rewrite unclear sections
- Update for new platform versions
- Reorganize confusing content
- Add missing prerequisites

### 💡 Ideas and Suggestions

**Discussion Topics:**

- Content gaps you've noticed
- User experience improvements
- Structure and organization ideas
- Technical accuracy concerns

## Development Setup

### Prerequisites

- **Node.js**: Version specified in `.nvmrc` file
- **npm**: For package management
- **Git**: For version control
- **Text editor**: With Markdown support recommended
- **[Vale](https://vale.sh/docs/vale-cli/installation/)**: For grammar and style checking

### Local Development Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/YOUR-USERNAME/docs.git
   cd docs
   ```

2. **Install dependencies:**

   ```bash
   nvm use  # Use correct Node version
   npm ci   # Install exact versions from lock file
   ```

3. **Set up Vale for grammar checking:**

   ```bash
   vale sync  # Install required Vale packages
   ```

4. **Start development server:**

   ```bash
   npm run start
   ```

   This opens your browser to `http://localhost:3000` with live reloading.

5. **Build and test:**

   ```bash
   npm run build  # Test production build
   npm run serve  # Serve production build locally
   ```

### Project Structure

```bash
docs/
├── docs/                    # Main documentation content
│   ├── tutorials/          # Learning-oriented guides
│   ├── how-to/             # Problem-solving guides
│   ├── explanation/        # Conceptual content
│   └── reference/          # Lookup information
├── src/                    # Website source code
│   ├── components/         # React components
│   ├── css/               # Styling
│   └── pages/             # Custom pages (homepage, etc.)
├── static/                # Static assets
├── docusaurus.config.ts   # Site configuration
└── sidebars.js           # Navigation configuration
```

### Working with Documentation

**Creating new pages:**

1. Add `.md` or `.mdx` files in appropriate `docs/` subdirectory
2. Include proper frontmatter (title, sidebar position, etc.)
3. Update navigation in `sidebars.js` if needed

**Using MDX features:**

- Import and use React components
- Include interactive examples
- Add custom styling when needed

**Testing your changes:**

- Always test locally before submitting
- Verify all links work
- Check responsive design on different screen sizes
- Test any code examples you include
- Run Vale for grammar and style checking:

  ```bash
  git diff --name-only | xargs vale --glob='!blog/*'
  ```

## Writing Guidelines

### Content Standards

**Follow our Style Guide**: See [STYLE_GUIDE.md](STYLE_GUIDE.md) for comprehensive guidelines on:

- Voice and tone
- Formatting standards
- Code examples
- Technical writing best practices

**Content Categories**: Make sure your content fits the right category:

- **Tutorials**: Step-by-step learning experiences
  - Have clear learning objectives
  - Build skills progressively
  - Include explanations of what's happening
  - End with what the user has accomplished

- **How-To Guides**: Task-oriented problem solving
  - Start with a clear problem statement
  - Provide efficient, direct solutions
  - Include troubleshooting for common issues
  - Focus on practical outcomes

- **Explanations**: Conceptual understanding
  - Explain the "why" behind concepts
  - Provide context and background
  - Use examples and analogies
  - Connect to broader themes

- **Reference**: Factual information
  - Comprehensive and accurate
  - Well-organized for lookup
  - Include examples for complex items
  - Cross-reference related information

### Technical Standards

**Code Examples:**

- Always specify programming language for syntax highlighting
- Test all code examples to ensure they work
- Include necessary imports and setup
- Use realistic variable names and data
- Add comments explaining non-obvious parts

**Links and References:**

- Use relative paths for internal links: `[Getting Started](../tutorials/getting-started)`
- Test all external links regularly
- Use descriptive link text: "View the API reference" not "click here"

**Images and Media:**

- Use images sparingly - they become outdated quickly
- Provide alt text for accessibility
- Optimize file sizes for web
- Use consistent styling when possible

## Contribution Workflow

### 1. Planning Your Contribution

**For small fixes** (typos, broken links, minor clarifications):

- Create an issue or jump straight to a pull request
- No need for extensive planning

**For larger changes** (new content, major rewrites):

1. **Create an issue** describing what you want to do and why
2. **Discuss the approach** with maintainers before starting
3. **Break large changes** into smaller, reviewable chunks

### 2. Making Changes

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/improve-tutorial-xyz
   ```

2. **Make your changes:**
   - Follow the style guide
   - Test your changes locally
   - Keep commits focused and atomic
   - Run Vale on your changes:

     ```bash
     git diff --name-only | xargs vale --glob='!blog/*'
     ```

3. **Commit your changes:**

   ```bash
   git add .
   git commit -m "docs: improve XYZ tutorial with clearer examples"
   ```

   **Commit Message Format:**
   - `docs:` prefix for documentation changes
   - Clear, concise description of what changed
   - Use present tense: "add" not "added"

4. **Push and create pull request:**

   ```bash
   git push origin feature/improve-tutorial-xyz
   ```

### 3. Pull Request Guidelines

**PR Description should include:**

- **What**: Clear description of changes made
- **Why**: Explanation of motivation and context
- **How**: Any relevant implementation details
- **Testing**: How you verified the changes work

**PR Title Format:**

- `docs: brief description of changes`
- Examples:
  - `docs: add tutorial for TDF file encryption`
  - `docs: fix broken links in API reference`
  - `docs: improve clarity in platform architecture explanation`

**Before submitting:**

- [ ] Changes tested locally via `npm run start`
- [ ] All links work correctly
- [ ] Code examples are tested
- [ ] Style guide followed
- [ ] Vale checks passed
- [ ] Screenshots updated if needed

### 4. Addressing Review Feedback

- **Respond promptly** to reviewer comments
- **Ask questions** if feedback is unclear
- **Make requested changes** in new commits (don't squash during review)
- **Test again** after making changes
- **Thank reviewers** for their time and input

## Review Process

### What to Expect

**Timeline:**

- Simple fixes: Usually reviewed within 2-3 days
- Complex changes: May take 5-7 days depending on scope
- Reviews may require multiple rounds of feedback

**Review Criteria:**

- **Technical accuracy**: Does the information work correctly?
- **Style compliance**: Does it follow our style guide?
- **User value**: Does this help users accomplish their goals?
- **Completeness**: Is all necessary information included?

### Types of Reviewers

**Technical Reviewers**: Verify accuracy of technical content
**Content Reviewers**: Focus on clarity, style, and user experience
**Subject Matter Experts**: Review domain-specific content for accuracy

### After Approval

1. **Squash commits** if requested by reviewers
2. **Update PR title/description** if needed
3. **Merge** will be handled by maintainers
4. **Changes go live** automatically when merged to main branch

## Community Guidelines

### Code of Conduct

We follow OpenTDF's Code of Conduct. In summary:

- **Be respectful** and inclusive
- **Be collaborative** and helpful
- **Be patient** with newcomers
- **Focus on the work**, not personalities

### Communication

**GitHub Issues**: For bug reports, feature requests, and planning discussions
**GitHub Discussions**: For general questions and community conversation
**Pull Request Comments**: For specific feedback on changes

### Getting Help

**Stuck on something?**

- Check existing documentation and issues first
- Ask specific questions in GitHub discussions
- Tag relevant maintainers in issues when appropriate
- Be patient - maintainers are often volunteers

**Want to help others?**

- Answer questions in discussions
- Review pull requests from other contributors
- Help triage and organize issues
- Share your expertise in your areas of knowledge

## Quality Assurance

### Grammar and Style Checking

**Check spelling and grammar for your changes:**

1. **Install Vale packages:**

   ```bash
   vale sync
   ```

2. **Run Vale on changed files:**

   ```bash
   git diff --name-only | xargs vale --glob='!blog/*'
   ```

3. **Address any issues** Vale identifies before submitting your PR

### Verify Changes Locally

**Always verify your changes on the Docusaurus server:**

To verify the placement and style of your changes as well as ensure there are no breaking changes, follow the [local development instructions](#local-development-setup) for running the Docusaurus server locally.

## Recognition

We value all contributions to OpenTDF documentation! Contributors are recognized in:

- **Release notes** for significant contributions
- **Contributors list** in the repository
- **Community highlights** in project communications
- **Maintainer consideration** for regular, high-quality contributors

## Quick Reference

### Common Tasks

**Fix a typo:**

1. Fork repo → make change → submit PR
2. No issue needed for obvious fixes

**Add new tutorial:**

1. Create issue to discuss scope and approach
2. Write content following tutorial guidelines
3. Test all steps thoroughly
4. Submit PR with comprehensive description

**Update outdated content:**

1. Create issue describing what's outdated and why
2. Update content and test changes
3. Submit PR explaining what was updated

**Report a problem:**

1. Check if issue already exists
2. Create detailed issue with steps to reproduce
3. Include environment info when relevant

### Resources

- [Style Guide](STYLE_GUIDE.md) - Writing and formatting standards
- [GitHub Issues](https://github.com/opentdf/docs/issues) - Bug reports and feature requests
- [OpenTDF Platform](https://github.com/opentdf/platform) - Main project repository
- [Live Documentation](https://docs.opentdf.io) - Current published docs

---

Thank you for contributing to OpenTDF documentation! Your efforts help developers and organizations implement data-centric security more effectively.
