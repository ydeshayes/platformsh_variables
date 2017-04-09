# platformsh_variables

This module will give you access to the `PLATFORM_ROUTES` environement variable in your front app.

If you are using `create-react-app-platformsh` >= 1.3.4, this is already built-in.

## Install
`npm install platformsh_variables`

In package.json add:

```
"buildenvvar": "platform-var"
```

In `.platform.app.yaml`
add:
```
mounts:
  '/build_platform': 'shared:files/build_platform'
  '/.tmp_platformsh': 'shared:files/tmp_platformsh'
```

Add `npm run buildenvvar` in the `deploy` hook.

and change your root location to the folder `build_platform`.

In your production webpack config, add `platformsh_variables` as external like:
```
externals: {
  'platformsh_variables': 'platformsh_variables'
},
```

## Use
```
import platformVar from 'platformsh_variables';

```
In development mode, the variable will be mocked (see lib/mock.js)
