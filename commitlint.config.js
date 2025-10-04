module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 120], // Max 100 characters (more realistic)
    'subject-max-length': [2, 'always', 120], // Max 100 characters for subject
    'body-max-line-length': [2, 'always', 180], // Max 120 characters per line

    // Format and style
    'subject-case': [2, 'always', 'lower-case'], // Lowercase required
    'subject-empty': [2, 'never'], // Subject cannot be empty
    'subject-full-stop': [2, 'never', '.'], // No ending period

    // Allowed types (customizable)
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, spaces, etc.
        'refactor', // Refactoring
        'perf', // Performance improvements
        'test', // Tests
        'build', // Build system
        'ci', // CI/CD
        'chore', // Minor tasks
        'revert', // Revert commit
      ],
    ],

    // Required structure
    'type-empty': [2, 'never'], // Type is required
    'type-case': [2, 'always', 'lower-case'], // Type in lowercase
  },
};
