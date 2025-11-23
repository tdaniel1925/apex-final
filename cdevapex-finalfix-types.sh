# Fix unused variable in cache.ts
sed -i 's/return function (target: any, propertyKey: string, descriptor:/return function (_target: any, _propertyKey: string, descriptor:/g' lib/performance/cache.ts

# Fix unused imports in db-optimization.ts  
sed -i 's/import { SQL, sql } from/import { sql } from/g' lib/performance/db-optimization.ts

# Fix unused destructured parameter in image-optimization.ts
sed -i 's/const { /const _unused = { /g' lib/performance/image-optimization.ts || true

# Fix rankAchievements import - add ranks schema
sed -i 's/export \* from/export * from '.\/ranks'\nexport * from/g' lib/db/schema/index.ts || true
