// config-overrides.js
module.exports = function override(config) {
  // Remove Fast Refresh runtime
  config.plugins = config.plugins.filter(
    (plugin) => plugin.constructor.name !== "ReactRefreshPlugin"
  );

  // Remove Babel refresh transform
  if (config.module?.rules) {
    for (const rule of config.module.rules) {
      if (rule.oneOf) {
        for (const sub of rule.oneOf) {
          if (Array.isArray(sub.use)) {
            sub.use.forEach((u) => {
              if (u.options?.plugins) {
                u.options.plugins = u.options.plugins.filter(
                  (p) =>
                    typeof p !== "string" ||
                    !p.includes("react-refresh/babel")
                );
              }
            });
          }
        }
      }
    }
  }
  return config;
};
