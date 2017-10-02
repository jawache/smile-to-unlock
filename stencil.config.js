// exports.config = {
//   bundles: [{ components: ["smile-to-unlock", "smile-to-unlock-hider"] }],
//   collections: [{ name: "@stencil/router" }]
// };

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};

exports.config = {
  namespace: 'smiletounlock',
  generateDistribution: true,
  generateWWW: false
};
