import browser from "webextension-polyfill";

const STORAGE_STATUS_KEY = "bongoManagerStatus";
const GROUP_NAME = "rwth";

export interface TokenInfo {
  tokenId: string;
  tokenSecret: string;
}

export const isExtensionEnabled = async (): Promise<boolean> => {
  return browser.storage.local
    .get(STORAGE_STATUS_KEY)
    .then((item) => item[STORAGE_STATUS_KEY] ?? true);
};

export const setExtensionEnabled = async (enable: boolean) => {
  browser.storage.local.set({ [STORAGE_STATUS_KEY]: enable });
};

export const setTokenInfo = (
  tokenInfo: TokenInfo,
  groupName: string = GROUP_NAME
) => {
  if (tokenInfo.tokenId.length === 0 || tokenInfo.tokenSecret.length === 0) {
    return;
  }
  getTokenInfo(groupName).then((info) => {
    if (info.tokenId.length > 0) {
      if (
        !confirm(
          "There is an existing token. Do you want to overwrite with new token?"
        )
      ) {
        return;
      }
    }
  });
  browser.storage.local.set({ [groupName]: tokenInfo });
};

export const getTokenInfo = async (
  groupName: string = GROUP_NAME
): Promise<TokenInfo> => {
  return browser.storage.local.get(groupName).then((obj) => obj[groupName]);
};
