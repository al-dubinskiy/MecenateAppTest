import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { observer } from "mobx-react-lite";
import { PostCard } from "../components/PostCard";
import { TabFilter } from "../components/TabFilter";
import { ErrorState } from "../components/ErrorState";
import { PostDetailScreen } from "./PostDetailScreen";
import { useFeed } from "../hooks/useFeed";
import { feedStore } from "../stores/feedStore";
import { colors, spacing, typography } from "../theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";

export const FeedScreen: React.FC = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    updatePostLike,
  } = useFeed({
    tier: feedStore.selectedTier,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePostPress = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onLikeUpdate={updatePostLike}
        onPress={() => handlePostPress(item.id)}
        onCommentPress={() => handleCommentPress(item.id)}
      />
    ),
    [updatePostLike, handlePostPress, handleCommentPress],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isError) {
    return (
      <ErrorState
        message="Не удалось загрузить публикации"
        onRetry={refetch}
        loading={isLoading}
        containerStyle={{ flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <TabFilter
        selectedFilter={feedStore.selectedTier}
        onSelectFilter={(filter) => feedStore.setSelectedTier(filter)}
      />

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 && styles.emptyList}
      />

      {isLoading && posts.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      <Modal
        visible={!!selectedPostId}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedPostId(null)}
      >
        {selectedPostId && (
          <PostDetailScreen
            postId={selectedPostId}
            onBack={() => {
              (setSelectedPostId(null), refetch());
            }}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
