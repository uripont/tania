import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';
import { useEffect } from 'react';

type GenericRoute = `${string}:${string}`;

type NavigationMethod = 'push' | 'replace' | 'navigate';

export const useNavigate = () => {
  const router = useRouter();

  //   // This restricts the user from going back to the previous screen
  //   useEffect(() => {
  //     const backAction = () => {
  //       return true;
  //     };
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       backAction
  //     );
  //     return () => backHandler.remove();
  //   }, [router]);

  const navigateTo = (
    relativePath: string,
    method: NavigationMethod = 'replace',
    params?: Record<string, any>
  ) => {
    const mergedParams = { headerShown: 'false', ...params };

    switch (method) {
      case 'navigate':
        router.navigate({
          pathname: relativePath as GenericRoute,
          params: mergedParams,
        });
        break;
      case 'push':
        router.push({
          pathname: relativePath as GenericRoute,
          params: mergedParams,
        });
        break;
      default:
        router.replace({
          pathname: relativePath as GenericRoute,
          params: mergedParams,
        });
        break;
    }
  };

  const goBack = () => {
    router.back();
  };

  return { navigateTo, goBack };
};
