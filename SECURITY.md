# Security Policy

## Reporting Vulnerabilities

DevMirror prioritizes developer safety when running external software repositories.

If you discover a security vulnerability or container isolation bypass in DevMirror, please report it via security email: `security@devmirror.dev`.

Please include:
- Detailed steps to reproduce the issue.
- Potential impact and target environment details.
- Any proof-of-concept scripts or manifest files.

We commit to acknowledging reports within 48 hours and issuing security patches promptly.

## Security Guarantees

- **No Sensitive Host Credentials**: DevMirror never mounts `~/.ssh`, `~/.aws`, `~/.gcp`, or browser profile paths inside sandbox containers.
- **Secret Masking**: Environment variables containing `SECRET`, `KEY`, `PASSWORD`, `TOKEN`, or `URL` are masked in all standard terminal output and JSON logs.
