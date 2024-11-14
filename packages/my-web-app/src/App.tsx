import { useSayHello } from "@my-monorepo/shared/hooks/useSayHello";
import { getScreenWidth } from "@my-monorepo/shared/utils/getScreenWidth";
import { Box } from "@my-monorepo/shared/components/box/Box";
import { Text } from "@my-monorepo/shared/components/text/Text.web";
import { Stack } from "@my-monorepo/shared/components/stack/Stack";
import { Inline } from "@my-monorepo/shared/components/inline/Inline";
import "./App.css";

function App() {
  useSayHello();
  console.log(getScreenWidth());

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "1280px",
        backgroundColor: "white",
      }}
    >
      <Inline verticalAlign={["top", "center", "bottom"]}>
        <Box
          shadow="high"
          padding={["medium", "none", "large"]}
          backgroundColor="white"
          borderRadius="medium"
        >
          <Stack space="medium">
          <Text type="title" color="dark">
            Open up App.tsx
          </Text>
          <Text type="body" color="dark">
            to start{" "}
            <Text color="dark" type="body" bold>
              working
            </Text>{" "}
            on your app!
          </Text>
          </Stack>
        </Box>
        <Box
          shadow="high"
          padding="medium"
          backgroundColor="white"
          borderRadius="medium"
        >
          <Stack space="medium">
          <Text type="title" color="dark">
            Open up App.tsx
          </Text>
          <Text type="title" color="dark">
            Open up App.tsx
          </Text>
          <Text type="title" color="dark">
            Open up App.tsx
          </Text>
          <Text type="body" color="dark">
            to start{" "}
            <Text color="dark" type="body" bold>
              working
            </Text>{" "}
            on your app!
          </Text>
          </Stack>
        </Box>
      </Inline>
    </div>
  );
}

export default App;
