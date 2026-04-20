import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Post } from '../api/types';
import { colors, spacing, borderRadius, typography, componentSizes } from '../theme/tokens';
import { formatRelativeDate } from '../utils/date';
import { postsApi } from '../api/posts';
import { useQueryClient } from '@tanstack/react-query';
import { textStyles } from '../theme/typography';
interface PostCardProps {
  post: Post;
  onLikeUpdate?: (postId: string, isLiked: boolean, likesCount: number) => void;
  onPress?: () => void;
  onCommentPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLikeUpdate, 
  onPress,
  onCommentPress 
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const localLikesCount = post.likesCount;
  const localIsLiked = post.isLiked;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
 
    try {
      const response = await postsApi.toggleLike(post.id);
      if (response.ok) {
        onLikeUpdate?.(post.id, response.data.isLiked, response.data.likesCount);
        // queryClient.invalidateQueries({ queryKey: ['feed'] });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLiking(false);
    }
  };

  const isPaid = post.tier === 'paid';
  const isContentLocked = isPaid;
  
  const contentText = post.body || post.preview || '';
  const shouldShowReadMore = contentText.length > 100;
  const displayText = !isExpanded && shouldShowReadMore 
    ? post.preview 
    : contentText;
  
  const handleShowMore = (event: any) => {
    event.stopPropagation();
    setIsExpanded(true);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
      disabled={isContentLocked}
    >
      {/* Header - Аватар, имя */}
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.author.displayName}
            </Text>
          </View>
        </View>
      </View>

      {/* Обложка с блюр-оверлеем для платных постов */}
      {post.coverUrl && (
        <View style={styles.coverWrapper}>
          <Image source={{ uri: post.coverUrl }} style={styles.coverImage} />
          
          {/* Блюр-оверлей для платного поста */}
          {isContentLocked && (
            <View style={styles.blurOverlay}>
              {/* Затемнение поверх изображения */}
              <BlurView intensity={70} tint="dark" style={styles.blurView} /* experimentalBlurMethod="dimezisBlurView" */>
                <View style={styles.paidContainer}>
                  <View style={styles.lockIconContainer}>
                    <View style={styles.lockIcon}>
                      <FontAwesome name="dollar" size={13} color={colors.primaryLight} />
                    </View>
                  </View>
                  <Text style={styles.paidText}>
                    Контент скрыт пользователем.{"\n"}Доступ откроется после доната
                  </Text>
                  <TouchableOpacity style={styles.donateButton}>
                    <Text style={styles.donateButtonText}>Отправить донат</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          )}
        </View>
      )}

      {/* Контент поста */}
      <View style={styles.contentWrapper}>
        {/* Title - Заголовок поста с скелетоном для платного */}
        {isContentLocked ? (
          <View style={styles.skeletonLine} />
        ) : (
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
        )}

        {/* Content - Для платных постов скелетон и кнопка доната */}
        {isContentLocked ? (
          <View style={[styles.skeletonLine, styles.skeletonLineFull]} />
        ) : (
          <View>
            <Text 
              style={styles.content} 
              numberOfLines={!isExpanded && shouldShowReadMore ? 3 : undefined}
            >
              {displayText}
            </Text>
            
            {shouldShowReadMore && !isExpanded && (
              <TouchableOpacity onPress={handleShowMore} activeOpacity={0.7}>
                <Text style={styles.readMoreButton}>Показать ещё</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Footer - Кнопки лайка и комментариев */}
     {!isContentLocked && <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.actionButton, localIsLiked && styles.actionButtonActive]} 
          onPress={handleLike} 
          disabled={isLiking}
        >
          <Ionicons
            name={localIsLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={localIsLiked ? colors.likeAactiveIcon : colors.likeInactiveIcon}
          />
          <Text style={[styles.actionText, localIsLiked && styles.actionTextActive]}>
            {localLikesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <Ionicons name="chatbubble" size={18} color={colors.likeInactiveIcon} />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: componentSizes.avatar.medium,
    height: componentSizes.avatar.medium,
    borderRadius: componentSizes.avatar.medium,
    marginRight: spacing.md,
    backgroundColor: colors.backgroundGray,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  authorName: {
    ...textStyles.labelBoldMedium,
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: spacing.md,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundGray,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lockIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    height: 20,
    width: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  contentWrapper: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...textStyles.labelBold,
    marginBottom: spacing.sm,
  },
  content: {
    ...textStyles.bodyMedium,
    marginBottom: spacing.xs,
  },
  readMoreButton: {
    ...textStyles.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.md,
    marginTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
    color: colors.textTertiary,
  },
  actionTextActive: {
    color: colors.textLight,
  },
  // Стили для платного поста
  paidContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  paidTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  paidText: {
    ...textStyles.h4,
    fontSize: 15,
    color: colors.textWhite,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  donateButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xxxxl,
    borderRadius: 14,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  donateButtonText: {
    ...textStyles.h4,
    fontSize: 15,
    color: colors.textWhite,
  },
  // Скелетон стили
  skeletonContainer: {
  },
  skeletonTitle: {
    marginBottom: spacing.sm,
  },
  skeletonTitleLine: {
    width: '80%',
    height: 22,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
  },
  skeletonLine: {
    height: 26,
    width: '40%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.xxl,
    marginBottom: spacing.sm,
  },
  skeletonLineFull: {
    height: 40,
    width: '100%',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});