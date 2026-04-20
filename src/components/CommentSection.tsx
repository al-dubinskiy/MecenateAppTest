import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComments } from '../hooks/useComments';
import { colors, spacing, borderRadius } from '../theme/tokens';
import { textStyles } from '../theme/typography';

interface CommentSectionProps {
  postId: string;
}

interface Comment {
  id: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

type SortType = 'newest' | 'oldest' | 'popular';

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [sortType, setSortType] = useState<SortType>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const {
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);

  // Функция для склонения слова "комментарий"
  const getCommentsCountText = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} комментариев`;
    }
    
    if (lastDigit === 1) {
      return `${count} комментарий`;
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} комментария`;
    }
    
    return `${count} комментариев`;
  };

  // Сортировка комментариев
  const getSortedComments = () => {
    if (!comments) return [];
    
    const sorted = [...comments];
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      default:
        return sorted;
    }
  };

  const handleLikeComment = (commentId: string) => {
    // Здесь будет API вызов для лайка комментария
    console.log('Like comment:', commentId);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.author.avatarUrl }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.author.displayName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => handleLikeComment(item.id)}
      >
        <Ionicons 
          name={item.isLiked ? 'heart' : 'heart-outline'} 
          size={16} 
          color={item.isLiked  ? colors.likeActive : colors.textTertiary} 
        />
        <Text style={[styles.likeCount, item.isLiked && styles.likeCountActive]}>
          {item.likesCount || 0}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmptyComments = () => (
    <View style={styles.emptyComments}>
      <Ionicons name="chatbubble-outline" size={48} color={colors.borderDark} />
      <Text style={styles.emptyCommentsText}>Нет комментариев</Text>
      <Text style={styles.emptyCommentsSubtext}>Будьте первым, кто оставит комментарий</Text>
    </View>
  );

  const sortedComments = getSortedComments();

  return (
    <ScrollView horizontal style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header с количеством комментариев и сортировкой */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {getCommentsCountText(comments.length)}
          </Text>
          
          {/* Кнопка сортировки */}
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Text style={styles.sortButtonText}>
              {sortType === 'newest' && 'Сначала новые'}
              {sortType === 'oldest' && 'Сначала старые'}
              {sortType === 'popular' && 'Сначала популярные'}
            </Text>
            {/* <Ionicons name="chevron-down" size={16} color={colors.textSecondary} /> */}
          </TouchableOpacity>
        </View>

        {/* Меню сортировки */}
        {showSortMenu && (
          <View style={styles.sortMenu}>
            <TouchableOpacity 
              style={[styles.sortMenuItem, sortType === 'newest' && styles.sortMenuItemActive]}
              onPress={() => {
                setSortType('newest');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortMenuItemText, sortType === 'newest' && styles.sortMenuItemTextActive]}>
                Сначала новые
              </Text>
              {sortType === 'newest' && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sortMenuItem, sortType === 'oldest' && styles.sortMenuItemActive]}
              onPress={() => {
                setSortType('oldest');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortMenuItemText, sortType === 'oldest' && styles.sortMenuItemTextActive]}>
                Сначала старые
              </Text>
              {sortType === 'oldest' && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sortMenuItem, sortType === 'popular' && styles.sortMenuItemActive]}
              onPress={() => {
                setSortType('popular');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortMenuItemText, sortType === 'popular' && styles.sortMenuItemTextActive]}>
                Сначала популярные
              </Text>
              {sortType === 'popular' && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Список комментариев */}
        <FlatList
          data={sortedComments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmptyComments : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={comments.length === 0 ? styles.emptyList : styles.commentsList}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
  },
  container: {
    width: Dimensions.get('screen').width,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    // paddingBottom: spacing.sm,
    paddingTop: spacing.lg,
  },
  headerTitle: {
    ...textStyles.h4,
    fontSize: 15,
    color: colors.textGray,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 4,
    paddingVertical: 4,
  },
  sortButtonText: {
    ...textStyles.bodyMedium,
    color: colors.buttonPrimary,
    fontSize: 15,
  },
  sortMenu: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    minWidth: 180,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sortMenuItemActive: {
    backgroundColor: colors.primaryBackground,
  },
  sortMenuItemText: {
    ...textStyles.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  sortMenuItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  commentsList: {
    paddingHorizontal: spacing.lg,
  },
  emptyList: {
    flexGrow: 1,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    marginRight: spacing.md,
    backgroundColor: colors.backgroundGray,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    ...textStyles.labelBoldMedium,
    fontSize: 14,
    marginBottom: 4,
  },
  commentText: {
    ...textStyles.bodyMedium,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  likeCountActive: {
    color: colors.likeActive,
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyCommentsText: {
    ...textStyles.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyCommentsSubtext: {
    ...textStyles.bodySmall,
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});