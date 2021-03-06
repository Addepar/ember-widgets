/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '1.13.13'
        }
      }
    },
    {
      name: 'ember-2.4',
      bower: {
        dependencies: {
          'ember': '2.4.6'
        }
      }
    },
    /*
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          'ember': '2.0.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8'
        },
        resolutions: {
          'ember': 'lts-2-8'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    */
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
