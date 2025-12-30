# API Gap List

## Public data access

- GET `api/vehicles` should be accessible without `bearerAuth` for the public landing page.
- (Optional) GET `api/vehicles/{id}` should be public if vehicle detail pages are added later.

Current `_docs/api_docs.md` sets global `bearerAuth`, so public access is not documented yet.
