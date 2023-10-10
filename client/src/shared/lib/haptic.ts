// import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import WebApp from '@twa-dev/sdk';


const impactMedium = async () => {
  // await Haptics.impact({ style: ImpactStyle.Medium });

  if (WebApp.initData) {
    WebApp.HapticFeedback.impactOccurred('medium');
  }
};

const impactLight = async () => {
  // if (isNativePlatform) {
  //   debugNative('hapticsImpactLight');
  //   await Haptics.impact({ style: ImpactStyle.Light });
  // }

  if (WebApp.initData) {
    WebApp.HapticFeedback.impactOccurred('light');
  }
};

const impactError = async () => {
  // if (isNativePlatform) {
  //   debugNative('notificationOccurredError');
  //   await Haptics.notification({ type: NotificationType.Error });
  // }

  if (WebApp.initData) {
    WebApp.HapticFeedback.notificationOccurred('error');
  }
};

export default {
  impactMedium,
  impactLight,
  impactError,
};
