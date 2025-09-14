import esbuildPluginTsc from 'esbuild-plugin-tsc';

export default () => ({
  bundle: true,
  minify: true,
  sourcemap: false,
  exclude: [],
  external: [],
  plugins: [esbuildPluginTsc()],
});
