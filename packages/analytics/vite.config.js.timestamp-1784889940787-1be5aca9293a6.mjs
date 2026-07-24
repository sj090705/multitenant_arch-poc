// vite.config.js
import { defineConfig } from "file:///sessions/nice-gifted-cannon/mnt/multitenant_arch-poc/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/nice-gifted-cannon/mnt/multitenant_arch-poc/node_modules/@vitejs/plugin-react/dist/index.js";
import federation from "file:///sessions/nice-gifted-cannon/mnt/multitenant_arch-poc/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "http://localhost:5002/",
  plugins: [
    react(),
    federation({
      name: "analytics",
      filename: "remoteEntry.js",
      exposes: {
        "./Module": "./src/Module.jsx"
      },
      shared: ["react", "react-dom"]
    })
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvbmljZS1naWZ0ZWQtY2Fubm9uL21udC9tdWx0aXRlbmFudF9hcmNoLXBvYy9wYWNrYWdlcy9hbmFseXRpY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9uaWNlLWdpZnRlZC1jYW5ub24vbW50L211bHRpdGVuYW50X2FyY2gtcG9jL3BhY2thZ2VzL2FuYWx5dGljcy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvbmljZS1naWZ0ZWQtY2Fubm9uL21udC9tdWx0aXRlbmFudF9hcmNoLXBvYy9wYWNrYWdlcy9hbmFseXRpY3Mvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGZlZGVyYXRpb24gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWZlZGVyYXRpb24nXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICdodHRwOi8vbG9jYWxob3N0OjUwMDIvJyxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZmVkZXJhdGlvbih7XG4gICAgICBuYW1lOiAnYW5hbHl0aWNzJyxcbiAgICAgIGZpbGVuYW1lOiAncmVtb3RlRW50cnkuanMnLFxuICAgICAgZXhwb3Nlczoge1xuICAgICAgICAnLi9Nb2R1bGUnOiAnLi9zcmMvTW9kdWxlLmpzeCdcbiAgICAgIH0sXG4gICAgICBzaGFyZWQ6IFsncmVhY3QnLCAncmVhY3QtZG9tJ11cbiAgICB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsb0JBQW9CO0FBQ3ZhLE9BQU8sV0FBVztBQUNsQixPQUFPLGdCQUFnQjtBQUV2QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTO0FBQUEsUUFDUCxZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0EsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLElBQy9CLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
