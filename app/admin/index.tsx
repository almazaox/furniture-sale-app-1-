import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart, 
  ChevronRight, 
  AlertTriangle, 
  ArrowLeft,
  Plus,
  Edit,
  Trash,
  X,
  Save
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import typography from '@/constants/typography';
import { mockUsers, mockOrders } from '@/mocks/users';
import { Product, productTypes } from '@/mocks/products';

export default function AdminPanel() {
  const router = useRouter();
  const { user, isAdmin, isModerator, hasAdminAccess } = useAuthStore();
  const { products, fetchProducts } = useProductStore();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = themes[theme];
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // Product form state
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOldPrice, setProductOldPrice] = useState('');
  const [productType, setProductType] = useState(productTypes[0]);
  const [productRating, setProductRating] = useState('4.5');
  const [productImageURL, setProductImageURL] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productInStock, setProductInStock] = useState(true);
  
  // User form state
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('visitor');
  
  // Order form state
  const [isOrderModalVisible, setOrderModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState('Processing');
  
  // Redirect if not admin or moderator
  if (!hasAdminAccess()) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ 
          title: t('accessDenied'),
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }} />
        
        <View style={styles.accessDeniedContainer}>
          <AlertTriangle size={64} color={colors.error} />
          <Text style={[typography.h2, styles.accessDeniedTitle, { color: colors.error }]}>
            {t('accessDenied')}
          </Text>
          <Text style={[styles.accessDeniedText, { color: colors.textSecondary }]}>
            {t('noPermission')}
          </Text>
          <Button
            title={t('backToAccount')}
            onPress={() => router.push('/(tabs)/account')}
            icon={<ArrowLeft size={18} color={colors.background} />}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Calculate statistics
  const totalProducts = products.length;
  const totalUsers = mockUsers.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Product management functions
  const handleAddProduct = () => {
    setIsEditingProduct(false);
    setCurrentProduct(null);
    setProductName('');
    setProductPrice('');
    setProductOldPrice('');
    setProductType(productTypes[0]);
    setProductRating('4.5');
    setProductImageURL('');
    setProductDescription('');
    setProductInStock(true);
    setProductModalVisible(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setIsEditingProduct(true);
    setCurrentProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductOldPrice(product.oldPrice ? product.oldPrice.toString() : '');
    setProductType(product.type);
    setProductRating(product.rating.toString());
    setProductImageURL(product.imageURL);
    setProductDescription(product.description);
    setProductInStock(product.inStock);
    setProductModalVisible(true);
  };
  
  const handleSaveProduct = () => {
    if (!productName || !productPrice || !productType) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    const newProduct: Product = {
      id: currentProduct?.id || `prod-${Date.now()}`,
      name: productName,
      price: parseFloat(productPrice),
      oldPrice: productOldPrice ? parseFloat(productOldPrice) : undefined,
      type: productType,
      rating: parseFloat(productRating),
      imageURL: productImageURL || 'https://via.placeholder.com/150',
      purchaseCount: currentProduct?.purchaseCount || 0,
      description: productDescription,
      inStock: productInStock
    };
    
    // Here you would update the store or mock data
    // For now, we'll just show a success message
    setToastMessage(isEditingProduct ? 'Product updated successfully' : 'Product added successfully');
    setToastType('success');
    setToastVisible(true);
    setProductModalVisible(false);
    
    // Simulate updating store
    if (!isEditingProduct) {
      // Add new product to mock data or store
      products.push(newProduct);
    } else {
      // Update existing product
      const index = products.findIndex(p => p.id === currentProduct?.id);
      if (index !== -1) {
        products[index] = newProduct;
      }
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // Remove product from mock data or store
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
              products.splice(index, 1);
            }
            setToastMessage('Product deleted successfully');
            setToastType('success');
            setToastVisible(true);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // User management functions
  const handleEditUser = (user: any) => {
    setIsEditingUser(true);
    setCurrentUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role || 'visitor');
    setUserModalVisible(true);
  };
  
  const handleSaveUser = () => {
    if (!userName || !userEmail) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    
    const updatedUser = {
      ...currentUser,
      name: userName,
      email: userEmail,
      role: userRole
    };
    
    // Update mock data or store
    const index = mockUsers.findIndex(u => u.id === currentUser?.id);
    if (index !== -1) {
      mockUsers[index] = updatedUser;
    }
    
    setToastMessage('User updated successfully');
    setToastType('success');
    setToastVisible(true);
    setUserModalVisible(false);
  };
  
  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // Remove user from mock data or store
            const index = mockUsers.findIndex(u => u.id === userId);
            if (index !== -1) {
              mockUsers.splice(index, 1);
            }
            setToastMessage('User deleted successfully');
            setToastType('success');
            setToastVisible(true);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Order management functions
  const handleEditOrder = (order: any) => {
    setCurrentOrder(order);
    setOrderStatus(order.status);
    setOrderModalVisible(true);
  };
  
  const handleSaveOrder = () => {
    // Update mock data or store
    const index = mockOrders.findIndex(o => o.id === currentOrder?.id);
    if (index !== -1) {
      mockOrders[index].status = orderStatus;
    }
    
    setToastMessage('Order updated successfully');
    setToastType('success');
    setToastVisible(true);
    setOrderModalVisible(false);
  };
  
  // Render dashboard tab
  const renderDashboard = () => (
    <View style={styles.tabContent}>
      <Text style={[typography.h2, styles.tabTitle, { color: colors.text }]}>
        {t('adminDashboard')}
      </Text>
      
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
        {t('statistics')}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          <Package size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{totalProducts}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalProducts')}</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          <Users size={24} color={colors.secondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{totalUsers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalUsers')}</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          <ShoppingBag size={24} color={colors.success} />
          <Text style={[styles.statValue, { color: colors.text }]}>{totalOrders}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalOrders')}</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          <BarChart size={24} color={colors.info} />
          <Text style={[styles.statValue, { color: colors.text }]}>{totalRevenue.toLocaleString()} ₽</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('revenue')}</Text>
        </View>
      </View>
      
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
        {t('quickActions')}
      </Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}
          onPress={() => setActiveTab('products')}
        >
          <Package size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>{t('manageProducts')}</Text>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        
        {isAdmin() && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}
              onPress={() => setActiveTab('users')}
            >
              <Users size={24} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.text }]}>{t('manageUsers')}</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}
              onPress={() => setActiveTab('orders')}
            >
              <ShoppingBag size={24} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.text }]}>{t('manageOrders')}</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
  
  // Render products tab
  const renderProducts = () => (
    <View style={styles.tabContent}>
      <Text style={[typography.h2, styles.tabTitle, { color: colors.text }]}>
        {t('productManagement')}
      </Text>
      
      <Button
        title={t('addProduct')}
        onPress={handleAddProduct}
        icon={<Plus size={18} color={colors.background} />}
        style={styles.addButton}
      />
      
      <ScrollView style={styles.listContainer}>
        {products.map((product) => (
          <View key={product.id} style={[styles.listItem, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.listItemSubtitle, { color: colors.textSecondary }]}>
                {product.price.toLocaleString()} ₽ • {product.type}
              </Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => handleEditProduct(product)}
              >
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
                onPress={() => handleDeleteProduct(product.id)}
              >
                <Trash size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
  // Render users tab (admin only)
  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={[typography.h2, styles.tabTitle, { color: colors.text }]}>
        {t('userManagement')}
      </Text>
      
      <ScrollView style={styles.listContainer}>
        {mockUsers.map((user) => (
          <View key={user.id} style={[styles.listItem, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: colors.text }]}>{user.name}</Text>
              <Text style={[styles.listItemSubtitle, { color: colors.textSecondary }]}>
                {user.email} • {t(user.role || 'visitor')}
              </Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => handleEditUser(user)}
              >
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
                onPress={() => handleDeleteUser(user.id)}
              >
                <Trash size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
  // Render orders tab (admin only)
  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={[typography.h2, styles.tabTitle, { color: colors.text }]}>
        {t('orderManagement')}
      </Text>
      
      <ScrollView style={styles.listContainer}>
        {mockOrders.map((order) => (
          <View key={order.id} style={[styles.listItem, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: colors.text }]}>
                {t('orderNumber')} {order.id}
              </Text>
              <Text style={[styles.listItemSubtitle, { color: colors.textSecondary }]}>
                {new Date(order.date).toLocaleDateString()} • {order.total.toLocaleString()} ₽ • {t(order.status.toLowerCase())}
              </Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => handleEditOrder(order)}
              >
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: t('adminPanel'),
        headerStyle: { backgroundColor: colors.cardBackground },
        headerTintColor: colors.text,
      }} />
      
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'dashboard' && [styles.activeTab, { borderColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('dashboard')}
          >
            <BarChart size={20} color={activeTab === 'dashboard' ? colors.primary : colors.textSecondary} />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'dashboard' ? colors.primary : colors.textSecondary }
              ]}
            >
              {t('adminDashboard')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'products' && [styles.activeTab, { borderColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('products')}
          >
            <Package size={20} color={activeTab === 'products' ? colors.primary : colors.textSecondary} />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'products' ? colors.primary : colors.textSecondary }
              ]}
            >
              {t('manageProducts')}
            </Text>
          </TouchableOpacity>
          
          {isAdmin() && (
            <>
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'users' && [styles.activeTab, { borderColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('users')}
              >
                <Users size={20} color={activeTab === 'users' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.tabText, 
                    { color: activeTab === 'users' ? colors.primary : colors.textSecondary }
                  ]}
                >
                  {t('manageUsers')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'orders' && [styles.activeTab, { borderColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('orders')}
              >
                <ShoppingBag size={20} color={activeTab === 'orders' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.tabText, 
                    { color: activeTab === 'orders' ? colors.primary : colors.textSecondary }
                  ]}
                >
                  {t('manageOrders')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && isAdmin() && renderUsers()}
        {activeTab === 'orders' && isAdmin() && renderOrders()}
      </ScrollView>
      
      {/* Product Modal */}
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h3, { color: colors.text }]}>
                {isEditingProduct ? t('editProduct') : t('addProduct')}
              </Text>
              <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Product name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Price (₽) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productPrice}
                  onChangeText={setProductPrice}
                  placeholder="Price in RUB"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Old Price (₽)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productOldPrice}
                  onChangeText={setProductOldPrice}
                  placeholder="Old price in RUB (optional)"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Type *</Text>
                <View style={[styles.dropdownInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={{ color: productType ? colors.text : colors.textSecondary }}>
                    {productType || 'Select product type'}
                  </Text>
                  <View style={styles.dropdownArrow}>
                    <ChevronRight size={18} color={colors.textSecondary} />
                  </View>
                </View>
                <ScrollView 
                  horizontal 
                  style={styles.typeSelector}
                  showsHorizontalScrollIndicator={false}
                >
                  {productTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption, 
                        productType === type && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setProductType(type)}
                    >
                      <Text style={[styles.typeOptionText, productType === type && { color: colors.primary }]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Rating</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productRating}
                  onChangeText={setProductRating}
                  placeholder="Rating (0-5)"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Image URL</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productImageURL}
                  onChangeText={setProductImageURL}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={productDescription}
                  onChangeText={setProductDescription}
                  placeholder="Product description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>In Stock</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, { backgroundColor: productInStock ? colors.success : colors.gray[300] }]}
                  onPress={() => setProductInStock(!productInStock)}
                >
                  <Text style={[styles.toggleButtonText, { color: colors.background }]}>
                    {productInStock ? 'YES' : 'NO'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setProductModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveProduct}
                icon={<Save size={18} color={colors.background} />}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* User Modal */}
      <Modal
        visible={isUserModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h3, { color: colors.text }]}>
                {t('editUser')}
              </Text>
              <TouchableOpacity onPress={() => setUserModalVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="User name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  placeholder="User email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
                <View style={[styles.dropdownInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={{ color: userRole ? colors.text : colors.textSecondary }}>
                    {t(userRole)}
                  </Text>
                  <View style={styles.dropdownArrow}>
                    <ChevronRight size={18} color={colors.textSecondary} />
                  </View>
                </View>
                <View style={styles.roleSelector}>
                  {['admin', 'moderator', 'visitor'].map(role => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption, 
                        userRole === role && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setUserRole(role)}
                    >
                      <Text style={[styles.roleOptionText, userRole === role && { color: colors.primary }]}>{t(role)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setUserModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveUser}
                icon={<Save size={18} color={colors.background} />}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Order Modal */}
      <Modal
        visible={isOrderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h3, { color: colors.text }]}>
                {t('editOrder')}
              </Text>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Order Status</Text>
                <View style={[styles.dropdownInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={{ color: orderStatus ? colors.text : colors.textSecondary }}>
                    {t(orderStatus.toLowerCase())}
                  </Text>
                  <View style={styles.dropdownArrow}>
                    <ChevronRight size={18} color={colors.textSecondary} />
                  </View>
                </View>
                <View style={styles.roleSelector}>
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.roleOption, 
                        orderStatus === status && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setOrderStatus(status)}
                    >
                      <Text style={[styles.roleOptionText, orderStatus === status && { color: colors.primary }]}>{t(status.toLowerCase())}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setOrderModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveOrder}
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
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
  },
  tabsContainer: {
    paddingVertical: 12,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    borderWidth: 1,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  addButton: {
    marginBottom: 16,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
  },
  listItemActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
    maxHeight: '50%',
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
  inputContainer: {
    marginBottom: 16,
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
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  dropdownInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  dropdownArrow: {
    position: 'absolute',
    right: 16,
  },
  typeSelector: {
    marginTop: 8,
    maxHeight: 40,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 8,
  },
  typeOptionText: {
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roleSelector: {
    marginTop: 8,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  roleOptionText: {
    fontSize: 14,
  },
});