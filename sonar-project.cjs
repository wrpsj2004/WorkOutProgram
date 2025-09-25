const mod = require('sonarqube-scanner');

const scanner =
  typeof mod === 'function'
    ? mod
    : typeof mod?.default === 'function'
    ? mod.default
    : typeof mod?.sonarqubeScanner === 'function'
    ? mod.sonarqubeScanner
    : typeof mod?.scanner === 'function'
    ? mod.scanner
    : null;

if (!scanner) {
  console.error('Cannot resolve sonarqube-scanner function export. Got:', mod);
  process.exit(1);
}

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: "sqp_4a398498bb68ae38644afc7e422cdf785d43c72a",
    options: {
      'sonar.projectKey': 'LifeHP-App',
      'sonar.projectName': 'LifeHP-App',
      'sonar.projectDescription': 'LifeHP-App',
      'sonar.sources': '.',
      'sonar.exclusions': 'node_modules/**,.next/**'
    }
  },
  () => process.exit()
);
