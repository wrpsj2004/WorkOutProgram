const mod = require("sonarqube-scanner");

const scanner =
  typeof mod === "function"
    ? mod
    : typeof mod?.default === "function"
    ? mod.default
    : typeof mod?.sonarqubeScanner === "function"
    ? mod.sonarqubeScanner
    : typeof mod?.scanner === "function"
    ? mod.scanner
    : null;

if (!scanner) {
  console.error("Cannot resolve sonarqube-scanner function export. Got:", mod);
  process.exit(1);
}

scanner(
  {
    serverUrl: "http://localhost:9000",
    token: "ระบุโทเค็นที่ได้จากระบบใน SonarQube",
    options: {
      "sonar.projectKey": "ระบุโปรเจกต์คีย์ให้ตรงกับตอนสร้างใน SonarQube",
      "sonar.projectName": "ระบุโปรเจกต์เนมให้ตรงกับตอนสร้างใน SonarQube",
      "sonar.projectDescription": "คำอธิบายโปรเจกต์",
      "sonar.sources": ".",
      "sonar.exclusions": "node_modules/**,.next/**",
    },
  },
  () => process.exit()
);
