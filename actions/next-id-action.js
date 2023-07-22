const validate = async (platform, identity, userAddress) => {
  try {
    const platformUrl = `https://proof-service.next.id/v1/proof?platform=${platform}&identity=${identity}&exact=true`;
    const walletmUrl = `https://proof-service.next.id/v1/proof?platform=ethereum&identity=${userAddress}&exact=true`;
    const platformResponse = await (await fetch(platformUrl)).json();
    const walletResponse = await (await fetch(walletmUrl)).json();
    const platformAvatars = platformResponse.ids.map((id) => id.avatar);
    const walletAvatars = walletResponse.ids.map((id) => id.avatar);
    const intersection = platformAvatars.filter((avatar) =>
      walletAvatars.includes(avatar)
    );
    return intersection.length > 0;
  } catch (e) {}
  return false;
};
