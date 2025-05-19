import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, LogOut, Package, User as UserIcon, Mail, ChevronDown, ChevronUp, MapPin, Clock, X, AlertTriangle, Edit, Save, Bell, Shield } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import typography from '@/constants/typography';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, login, register, logout, updateUser, isLoading, error, clearError, hasAdminAccess, isAdmin, isModerator } = useAuthStore();
  const { orders, getUserOrders, cancelOrder, trackOrder } = useOrderStore();
  const { t, language } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // State to track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // State to track which orders are showing tracking info
  const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>({});

  // State for profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Open edit profile modal
  const handleEditProfile = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setNotificationsEnabled(user.notificationsEnabled || false);
      setIsEditingProfile(true);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    // Validate inputs
    if (!editName.trim()) {
      setToastMessage(t('pleaseEnterName'));
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    if (!editEmail.trim()) {
      setToastMessage(t('pleaseEnterEmail'));
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setToastMessage(t('invalidEmail'));
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    try {
      await updateUser({
        ...user,
        name: editName,
        email: editEmail,
        notificationsEnabled
      });
      
      setIsEditingProfile(false);
      setToastMessage(t('profileUpdated'));
      setToastType('success');
      setToastVisible(true);
    } catch (err) {
      setToastMessage(t('updateFailed'));
      setToastType('error');
      setToastVisible(true);
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    clearError();
    
    // Validate inputs
    if (!email.trim()) {
      setToastMessage(t('pleaseEnterEmail'));
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    if (!password.trim()) {
      setToastMessage(t('pleaseEnterPassword'));
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        setToastMessage(t('passwordsNotMatch'));
        setToastType('error');
        setToastVisible(true);
        return;
      }
      
      if (!name.trim()) {
        setToastMessage(t('pleaseEnterName'));
        setToastType('error');
        setToastVisible(true);
        return;
      }
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleLogout = () => {
    logout();
    setToastMessage(t('loggedOut'));
    setToastType('info');
    setToastVisible(true);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  // Show error from auth store
  React.useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType('error');
      setToastVisible(true);
    }
  }, [error]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Toggle expanded state for an order
  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  // Toggle tracking info for an order
  const toggleTrackingInfo = (orderId: string) => {
    setTrackingOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  // Handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      t('cancelOrderTitle'),
      t('cancelOrderConfirm'),
      [
        {
          text: t('no'),
          style: 'cancel'
        },
        {
          text: t('yes'),
          onPress: () => {
            cancelOrder(orderId);
            setToastMessage(t('orderCancelled'));
            setToastType('success');
            setToastVisible(true);
          }
        }
      ]
    );
  };

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return colors.primary;
      case 'Shipped':
        return colors.secondary;
      case 'Delivered':
        return colors.success;
      case 'Cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };
  
  // Get status icon based on order status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock size={16} color={getStatusColor(status)} />;
      case 'Shipped':
        return <Package size={16} color={getStatusColor(status)} />;
      case 'Delivered':
        return <Package size={16} color={getStatusColor(status)} />;
      case 'Cancelled':
        return <X size={16} color={getStatusColor(status)} />;
      default:
        return <Package size={16} color={getStatusColor(status)} />;
    }
  };

  // Get user's orders
  const userOrders = user ? getUserOrders(user.id) : [];
  
  // Navigate to admin panel
  const handleAdminPanelAccess = () => {
    router.push('/admin');
  };

  // Get role display name
  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'admin':
        return t('admin');
      case 'moderator':
        return t('moderator');
      case 'visitor':
      default:
        return t('visitor');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {isAuthenticated && user ? (
            // User profile
            <View style={styles.profileContainer}>
              <View style={styles.profileHeader}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                  <UserIcon size={40} color={colors.background} />
                </View>
                <Text style={[typography.h2, styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                
                {/* User role badge */}
                <View style={[styles.roleBadge, { 
                  backgroundColor: user.role === 'admin' ? colors.error + '20' : 
                                  user.role === 'moderator' ? colors.secondary + '20' : 
                                  colors.primary + '20' 
                }]}>
                  <Shield size={14} color={
                    user.role === 'admin' ? colors.error : 
                    user.role === 'moderator' ? colors.secondary : 
                    colors.primary
                  } />
                  <Text style={[styles.roleText, { 
                    color: user.role === 'admin' ? colors.error : 
                           user.role === 'moderator' ? colors.secondary : 
                           colors.primary 
                  }]}>
                    {getRoleDisplayName(user.role)}
                  </Text>
                </View>
              </View>
              
              {/* Admin Panel Access Button */}
              {hasAdminAccess() && (
                <TouchableOpacity 
                  style={[styles.adminPanelButton, { 
                    backgroundColor: isAdmin() ? colors.error + '20' : colors.secondary + '20',
                    borderColor: isAdmin() ? colors.error : colors.secondary
                  }]}
                  onPress={handleAdminPanelAccess}
                >
                  <Shield size={20} color={isAdmin() ? colors.error : colors.secondary} />
                  <Text style={[styles.adminPanelText, { 
                    color: isAdmin() ? colors.error : colors.secondary 
                  }]}>
                    {t('adminPanelAccess')}
                  </Text>
                  <ChevronUp size={20} color={isAdmin() ? colors.error : colors.secondary} />
                </TouchableOpacity>
              )}
              
              <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('accountInformation')}</Text>
                  <TouchableOpacity 
                    style={[styles.editButton, { backgroundColor: colors.gray[100] }]} 
                    onPress={handleEditProfile}
                  >
                    <Edit size={16} color={colors.primary} />
                    <Text style={[styles.editButtonText, { color: colors.primary }]}>{t('edit')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <UserIcon size={20} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('name')}:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Mail size={20} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('email')}:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Bell size={20} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('notifications')}:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {user.notificationsEnabled ? t('enabled') : t('disabled')}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Shield size={20} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('userRole')}:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {getRoleDisplayName(user.role)}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.section, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
                <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>{t('orderHistory')}</Text>
                {userOrders.length > 0 ? (
                  userOrders.map(order => (
                    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.gray[100] }]}>
                      {/* Order Header */}
                      <View style={styles.orderHeader}>
                        <View style={styles.orderIdContainer}>
                          <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>{t('orderNumber')}</Text>
                          <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>
                        </View>
                        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{formatDate(order.date)}</Text>
                      </View>
                      
                      {/* Order Status */}
                      <View style={styles.orderStatus}>
                        {getStatusIcon(order.status)}
                        <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                          {t(order.status.toLowerCase())}
                        </Text>
                      </View>
                      
                      {/* Order Summary */}
                      <View style={styles.orderDetails}>
                        <Text style={[styles.orderItemCount, { color: colors.text }]}>
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('items')}
                        </Text>
                        <Text style={[styles.orderTotal, { color: colors.primary }]}>{order.total.toLocaleString()} ₽</Text>
                      </View>
                      
                      {/* Order Address */}
                      {order.address && (
                        <View style={styles.orderAddressContainer}>
                          <MapPin size={16} color={colors.textSecondary} />
                          <Text style={[styles.orderAddress, { color: colors.textSecondary }]}>
                            {order.address}
                          </Text>
                        </View>
                      )}
                      
                      {/* Order Actions */}
                      <View style={styles.orderActions}>
                        {/* Toggle Items Button */}
                        <TouchableOpacity 
                          style={[styles.orderActionButton, { borderColor: colors.border }]} 
                          onPress={() => toggleOrderExpanded(order.id)}
                        >
                          <Text style={[styles.orderActionText, { color: colors.primary }]}>
                            {expandedOrders[order.id] ? t('hideItems') : t('showItems')}
                          </Text>
                          {expandedOrders[order.id] ? 
                            <ChevronUp size={16} color={colors.primary} /> : 
                            <ChevronDown size={16} color={colors.primary} />
                          }
                        </TouchableOpacity>
                        
                        {/* Track Order Button - only for shipped orders */}
                        {order.status === 'Shipped' && (
                          <TouchableOpacity 
                            style={[styles.orderActionButton, { borderColor: colors.border }]} 
                            onPress={() => toggleTrackingInfo(order.id)}
                          >
                            <Text style={[styles.orderActionText, { color: colors.secondary }]}>
                              {trackingOrders[order.id] ? t('hideTracking') : t('trackOrder')}
                            </Text>
                            {trackingOrders[order.id] ? 
                              <ChevronUp size={16} color={colors.secondary} /> : 
                              <Package size={16} color={colors.secondary} />
                            }
                          </TouchableOpacity>
                        )}
                        
                        {/* Cancel Order Button - only for processing orders */}
                        {order.status === 'Processing' && (
                          <TouchableOpacity 
                            style={[styles.orderActionButton, { borderColor: colors.border }]} 
                            onPress={() => handleCancelOrder(order.id)}
                          >
                            <Text style={[styles.orderActionText, { color: colors.error }]}>
                              {t('cancelOrder')}
                            </Text>
                            <X size={16} color={colors.error} />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {/* Expanded Order Items */}
                      {expandedOrders[order.id] && (
                        <View style={[styles.expandedItems, { backgroundColor: colors.background }]}>
                          <Text style={[styles.expandedItemsTitle, { color: colors.text }]}>{t('orderItems')}</Text>
                          {order.items.map((item, index) => (
                            <View key={index} style={[styles.orderItem, { borderBottomColor: colors.border }]}>
                              <View style={styles.orderItemDetails}>
                                <Text style={[styles.orderItemName, { color: colors.text }]}>
                                  {item.name || `Product #${item.productId}`}
                                </Text>
                                <Text style={[styles.orderItemQuantity, { color: colors.textSecondary }]}>
                                  {t('quantity')}: {item.quantity}
                                </Text>
                              </View>
                              <Text style={[styles.orderItemPrice, { color: colors.primary }]}>
                                {(item.price || 0).toLocaleString()} ₽
                              </Text>
                            </View>
                          ))}
                          <View style={styles.orderItemTotal}>
                            <Text style={[styles.orderItemTotalLabel, { color: colors.textSecondary }]}>{t('total')}</Text>
                            <Text style={[styles.orderItemTotalValue, { color: colors.primary }]}>
                              {order.total.toLocaleString()} ₽
                            </Text>
                          </View>
                        </View>
                      )}
                      
                      {/* Tracking Information */}
                      {trackingOrders[order.id] && order.status === 'Shipped' && (
                        <View style={[styles.trackingInfo, { backgroundColor: colors.background }]}>
                          <Text style={[styles.trackingTitle, { color: colors.text }]}>{t('trackingInformation')}</Text>
                          
                          <View style={styles.trackingDetail}>
                            <Text style={[styles.trackingLabel, { color: colors.textSecondary }]}>{t('trackingNumber')}</Text>
                            <Text style={[styles.trackingValue, { color: colors.text }]}>TRK{Math.floor(Math.random() * 1000000)}</Text>
                          </View>
                          
                          <View style={styles.trackingDetail}>
                            <Text style={[styles.trackingLabel, { color: colors.textSecondary }]}>{t('estimatedDelivery')}</Text>
                            <Text style={[styles.trackingValue, { color: colors.text }]}>
                              {new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Text>
                          </View>
                          
                          <View style={styles.trackingDetail}>
                            <Text style={[styles.trackingLabel, { color: colors.textSecondary }]}>{t('currentLocation')}</Text>
                            <Text style={[styles.trackingValue, { color: colors.text }]}>{t('sortingCenter')}</Text>
                          </View>
                          
                          <View style={[styles.trackingProgress, { backgroundColor: colors.gray[200] }]}>
                            <View style={[styles.trackingProgressFill, { width: '60%', backgroundColor: colors.secondary }]} />
                          </View>
                          
                          <View style={styles.trackingSteps}>
                            <View style={styles.trackingStep}>
                              <View style={[styles.trackingStepDot, { backgroundColor: colors.success }]} />
                              <Text style={[styles.trackingStepText, { color: colors.text }]}>{t('orderPlaced')}</Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View style={[styles.trackingStepDot, { backgroundColor: colors.success }]} />
                              <Text style={[styles.trackingStepText, { color: colors.text }]}>{t('orderProcessed')}</Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View style={[styles.trackingStepDot, { backgroundColor: colors.secondary }]} />
                              <Text style={[styles.trackingStepText, { color: colors.text }]}>{t('inTransit')}</Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View style={[styles.trackingStepDot, { backgroundColor: colors.gray[300] }]} />
                              <Text style={[styles.trackingStepText, { color: colors.textSecondary }]}>{t('outForDelivery')}</Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View style={[styles.trackingStepDot, { backgroundColor: colors.gray[300] }]} />
                              <Text style={[styles.trackingStepText, { color: colors.textSecondary }]}>{t('deliveredStatus')}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={[styles.noOrdersText, { color: colors.textSecondary }]}>{t('noOrdersFound')}</Text>
                )}
              </View>
              
              <Button
                title={t('logOut')}
                onPress={handleLogout}
                variant="outline"
                icon={<LogOut size={18} color={colors.primary} />}
                style={styles.logoutButton}
              />
            </View>
          ) : (
            // Login/Register form
            <View style={styles.formContainer}>
              <Text style={[typography.h1, styles.formTitle, { color: colors.text }]}>
                {isLogin ? t('welcomeBack') : t('createAccount')}
              </Text>
              <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                {isLogin ? t('signInAccess') : t('fillDetails')}
              </Text>
              
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>{t('name')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder={t('yourName')}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                  />
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('email')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('emailPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('password')}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t('yourPassword')}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>{t('confirmPassword')}</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.passwordInput, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder={t('confirmYourPassword')}
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} />
                      ) : (
                        <Eye size={20} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <Button
                title={isLogin ? t('signIn') : t('signUp')}
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.submitButton}
              />
              
              <View style={styles.switchFormContainer}>
                <Text style={[styles.switchFormText, { color: colors.textSecondary }]}>
                  {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                </Text>
                <TouchableOpacity onPress={toggleForm}>
                  <Text style={[styles.switchFormLink, { color: colors.primary }]}>
                    {isLogin ? t('signUp') : t('signIn')}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {isLogin && (
                <View style={styles.demoCredentialsContainer}>
                  <Text style={[styles.demoCredentials, { color: colors.textSecondary }]}>
                    {t('userLogin')}: {t('demoCredentials')}
                  </Text>
                  <Text style={[styles.demoCredentials, { color: colors.textSecondary }]}>
                    {t('adminLogin')}: {t('adminCredentials')}
                  </Text>
                  <Text style={[styles.demoCredentials, { color: colors.textSecondary }]}>
                    {t('moderatorLogin')}: {t('moderatorCredentials')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditingProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditingProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h3, { color: colors.text }]}>{t('editProfile')}</Text>
              <TouchableOpacity onPress={() => setIsEditingProfile(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('name')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={t('yourName')}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t('email')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder={t('emailPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>{t('enableNotifications')}</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.gray[300], true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title={t('cancel')}
                onPress={() => setIsEditingProfile(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={t('saveChanges')}
                onPress={handleSaveProfile}
                icon={<Save size={18} color={colors.background} />}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  
  // Profile styles
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  adminPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    gap: 8,
  },
  adminPanelText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  orderCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderIdContainer: {
    flexDirection: 'column',
  },
  orderIdLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemCount: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderAddress: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  orderActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  orderActionText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  expandedItems: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  expandedItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  orderItemTotalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemTotalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  trackingInfo: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  trackingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  trackingDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trackingLabel: {
    fontSize: 12,
  },
  trackingValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  trackingProgress: {
    height: 6,
    borderRadius: 3,
    marginVertical: 16,
    overflow: 'hidden',
  },
  trackingProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  trackingSteps: {
    marginTop: 8,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingStepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  trackingStepText: {
    fontSize: 12,
  },
  noOrdersText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  logoutButton: {
    marginTop: 8,
  },
  
  // Form styles
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  submitButton: {
    marginTop: 8,
  },
  switchFormContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchFormText: {
    fontSize: 14,
  },
  switchFormLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  demoCredentialsContainer: {
    marginTop: 16,
  },
  demoCredentials: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});