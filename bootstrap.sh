export home="/home/vcap"

## Updated ~/.bashrc to update $PATH when someone logs in.
[ -z $(cat ${home}/.bashrc | grep PATH) ] && \
  touch ${home}/.bashrc && \
  echo "alias nano=\"${home}/deps/0/apt/bin/nano\"" >> ${home}/.bashrc && \
  echo "PATH=$PATH:/home/vcap/app/php/bin:/home/vcap/app/vendor/drush/drush" >> /home/vcap/.bashrc

source ${home}/.bashrc

SECRETS=$(echo "$VCAP_SERVICES" | jq -r '.["user-provided"][] | select(.name == "secrets") | .credentials')
APP_NAME=$(echo "$VCAP_APPLICATION" | jq -r '.name')
APP_ROOT=$(dirname "${BASH_SOURCE[0]}")
DOC_ROOT="$APP_ROOT/web"
APP_ID=$(echo "$VCAP_APPLICATION" | jq -r '.application_id')

install_drupal() {
  ROOT_USER_NAME=$(echo "$SECRETS" | jq -r '.ROOT_USER_NAME')
  ROOT_USER_PASS=$(echo "$SECRETS" | jq -r '.ROOT_USER_PASS')

  : "${ROOT_USER_NAME:?Need and root user name for Drupal}"
  : "${ROOT_USER_PASS:?Need and root user pass for Drupal}"

  drush site:install minimal \
      --no-interaction \
      --account-name="$ROOT_USER_NAME" \
      --account-pass="$ROOT_USER_PASS" \
      --existing-config
}

# If there is no "config:import" command, Drupal needs to be installed
drush list | grep "config:import" > /dev/null || install_drupal
