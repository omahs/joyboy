import { View, Image, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Typography, Divider, KeyboardAvoidingView } from "../../components";
import { useNostr } from "../../hooks/useNostr";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import { Container, Photo, PostButton, TitleContainer } from "./styled";

export default function CreatePost() {
  const navigation = useNavigation();

  const { sendNote } = useNostr();
  const { retrieveAndDecryptPrivateKey } = useLocalstorage();
  const [note, setNote] = useState<string | undefined>();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePostNote = useCallback(async () => {
    try {
      console.log("handle send note");
      // do something on post
      if (!note || note?.length == 0) {
        alert("Write your note");
        return;
      }
      alert("Note sending, please wait.");
      let { array } = await retrieveAndDecryptPrivateKey();

      if (!array) {
        alert("Please login before send a note");
        return;
      }

      /** @TODO handle tags NIP-10  */
      let noteEvent = sendNote(array, note);
      console.log("noteEvent", noteEvent);
      if (noteEvent?.isValid) {
        alert("Note send");
      }
    } catch (e) {
      console.log("Error send note", e);
    }
  }, [note]);
  const isCreateDisabled = note && note?.length > 0 ? false : true;

  return (
    <KeyboardAvoidingView>
      <Container>
        <Pressable onPress={handleGoBack}>
          <Typography variant="ts15r">Cancel</Typography>
        </Pressable>

        <PostButton onPress={handlePostNote} disabled={isCreateDisabled}>
          <Typography variant="ts15r">Post</Typography>
        </PostButton>
      </Container>

      <View style={{ marginBottom: 12 }}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo source={{ uri: "https://picsum.photos/201/300" }} />
        <TextInput
          autoFocus
          multiline={true}
          value={note}
          placeholder="Title"
          onChangeText={setNote}
        />
      </TitleContainer>
    </KeyboardAvoidingView>
  );
}
