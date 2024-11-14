import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { useSayHello } from '@my-monorepo/shared/hooks/useSayHello';
import { getScreenWidth } from '@my-monorepo/shared/utils/getScreenWidth';
import { Flex } from '@my-monorepo/shared/components/flex/Flex';
import { Text } from '@my-monorepo/shared/components/text/Text.native';

export default function App() {
  useSayHello();
  console.log(getScreenWidth());
  return (
    <View style={styles.container}>
      <Flex
        flexDirection="column"
        shadow="high"
        backgroundColor="white"
        borderRadius="medium"
        padding={["none", "none", "large"]}
        alignItems="center"
      >
        <Text type="title" color="dark">Open up App.tsx</Text>
        <Text type="body" color="dark">to start <Text color="dark" type="body" bold>working</Text> on your app!</Text>
      </Flex>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
