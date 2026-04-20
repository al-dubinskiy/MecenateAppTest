import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePost } from "../hooks/usePost";
import { CommentSection } from "../components/CommentSection";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  componentSizes,
  shadows,
} from "../theme/tokens";
import { formatRelativeDate } from "../utils/date";
import { textStyles } from "../theme/typography";
import { useComments } from "../hooks/useComments";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "../components/ErrorState";
import { useFeed } from "../hooks/useFeed";

interface PostDetailScreenProps {
  postId: string;
  onBack?: () => void;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  postId,
  onBack,
}) => {
  const { post, isLoading, isError, toggleLike, isTogglingLike, refetch } =
    usePost(postId);
  const [commentText, setCommentText] = useState("");

  const { addComment, isAddingComment } = useComments(postId);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(commentText.trim());
      setCommentText("");
      Keyboard.dismiss();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const isPaid = post.tier === "paid";
  const isContentLocked = isPaid && !post.body;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} />

      {/* Header с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Публикация</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Информация об авторе */}
        <View style={styles.authorSection}>
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.displayName}</Text>
              {/* {post.author.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              )} */}
            </View>
            {/* <Text style={styles.authorTime}>{formatRelativeDate(post.createdAt)}</Text> */}
          </View>
        </View>

        {isError || !post ? (
          <ErrorState
            message="Не удалось загрузить публикацию"
            loading={isLoading}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {isContentLocked ? (
              <View style={styles.paidContainer}>
                <View style={styles.lockIconContainer}>
                  <Ionicons
                    name="lock-closed"
                    size={32}
                    color={colors.textSecondary}
                  />
                </View>
                <Text style={styles.paidText}>
                  Контент скрыт пользователем.{'\n'}Доступ откроется после доната
                </Text>
                <TouchableOpacity style={styles.donateButton}>
                  <Text style={styles.donateButtonText}>Отправить донат</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                {post.coverUrl && (
                  <Image
                    source={{ uri: post.coverUrl }}
                    style={styles.coverImage}
                  />
                )}

                {/* Заголовок поста */}
                <Text style={styles.title}>{post.title}</Text>

                <Text style={styles.content}>{post.body || post.preview}</Text>

                {/* Кнопки лайка и комментариев */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      post.isLiked && styles.actionButtonActive,
                    ]}
                    onPress={() => toggleLike()}
                    disabled={isTogglingLike}
                  >
                    <Ionicons
                      name={post.isLiked ? "heart" : "heart-outline"}
                      size={18}
                      color={
                        post.isLiked
                          ? colors.likeAactiveIcon
                          : colors.likeInactiveIcon
                      }
                    />
                    <Text
                      style={[
                        styles.actionText,
                        post.isLiked && styles.actionTextActive,
                      ]}
                    >
                      {post.likesCount}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.actionButton}>
                    <Ionicons
                      name="chatbubble"
                      size={18}
                      color={colors.likeInactiveIcon}
                    />
                    <Text style={styles.actionText}>{post.commentsCount}</Text>
                  </View>
                </View>

                {/* Секция комментариев */}
                <CommentSection postId={post.id} />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Поле ввода комментария */}
      {isError || !post ? null : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ваш комментарий"
            placeholderTextColor={colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!commentText.trim() || isAddingComment) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleAddComment}
            disabled={!commentText.trim() || isAddingComment}
          >
            {isAddingComment ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={
                  !commentText.trim()
                    ? colors.primaryBackground
                    : colors.primary
                }
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    backgroundColor: colors.background,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    // paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  avatar: {
    width: componentSizes.avatar.medium,
    height: componentSizes.avatar.medium,
    borderRadius: componentSizes.avatar.medium,
    marginRight: spacing.md,
    backgroundColor: colors.backgroundGray,
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    // marginBottom: 4,
  },
  authorName: {
    ...textStyles.labelBoldMedium,
  },
  authorTime: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  title: {
    ...textStyles.labelBold,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  coverImage: {
    width: "100%",
    height: 300,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundGray,
  },
  content: {
    ...textStyles.bodyMedium,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.likeInactive,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: 12,
    height: 36,
  },
  actionButtonActive: {
    backgroundColor: colors.likeActive,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textTertiary,
  },
  actionTextActive: {
    color: colors.textLight,
  },
  paidContainer: {
    margin: spacing.lg,
    padding: spacing.xxxl,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  paidTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  paidText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  donateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  donateButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textWhite,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.background,
  },
  input: {
    ...textStyles.bodyMedium,
    flex: 1,
    fontSize: 15,
    minHeight: 40,
    maxHeight: 200,
    padding: 0,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: "#EFF2F7",
    borderRadius: spacing.xl,
  },
  sendButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {},
});
