import '@testing-library/jest-native/extend-expect';

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    getFirstSync: jest.fn(),
    getAllSync: jest.fn(),
    runSync: jest.fn(),
  })),
  useSQLiteContext: jest.fn(() => ({
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
    withTransactionAsync: jest.fn(async (cb) => {
      await cb();
    }),
  })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-user-id', isAnonymous: false },
    signInAnonymously: jest.fn(),
    signInWithCredential: jest.fn(),
    signOut: jest.fn(),
  })),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn(),
  })),
  query: jest.fn(),
  where: jest.fn(),
  setDoc: jest.fn(),
}));

const mockFileSystem = {
  documentDirectory: 'file:///test-directory/',
  cacheDirectory: 'file:///test-cache-directory/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, isDirectory: true })),
  readDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8', Base64: 'base64' },
  StorageAccessFramework: {
    getUriForDirectoryInVolume: jest.fn(),
    requestDirectoryPermissionsAsync: jest.fn(),
    readDirectoryAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    createFileAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
  }
};
jest.mock('expo-file-system', () => mockFileSystem);
jest.mock('expo-file-system/legacy', () => mockFileSystem);

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(),
}));

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ data: { idToken: 'test-id-token' } })),
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const BottomSheetModal = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      present: jest.fn(),
      dismiss: jest.fn(),
      close: jest.fn(),
    }));
    return <div testID="bottom-sheet">{props.children}</div>;
  });
  const BottomSheetView = ({ children }) => <div>{children}</div>;
  const BottomSheetTextInput = (props) => <input {...props} />;
  const BottomSheetBackdrop = (props) => <div testID="bottom-sheet-backdrop" {...props} />;
  return {
    BottomSheetModalProvider: ({ children }) => <>{children}</>,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetTextInput,
    BottomSheetBackdrop,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useFocusEffect: jest.fn((cb) => cb()),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  return {
    FlashList: ({ data, renderItem }) => (
      <div testID="flash-list">
        {data.map((item, index) => renderItem({ item, index }))}
      </div>
    ),
  };
});
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    __esModule: true,
    ...Reanimated,
    FadeInDown: {
      duration: () => ({
        springify: () => ({
          delay: () => ({
            duration: () => ({
              springify: () => ({})
            })
          })
        })
      }),
      delay: () => ({
        duration: () => ({
          springify: () => ({})
        })
      })
    }
  };
});

