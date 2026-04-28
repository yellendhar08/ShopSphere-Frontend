import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/catalog/home/home.component';
import { ProductListComponent } from './features/catalog/product-list/product-list.component';
import { ProductDetailComponent } from './features/catalog/product-detail/product-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { PaymentComponent } from './features/orders/payment/payment.component';
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminProductFormComponent } from './features/admin/admin-product-form/admin-product-form.component';
import { AdminReportsComponent } from './features/admin/admin-reports/admin-reports.component';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [noAuthGuard] },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
      { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
      { path: 'my-orders', component: OrderListComponent, canActivate: [authGuard] },
      { path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/new', component: AdminProductFormComponent },
      { path: 'products/:id/edit', component: AdminProductFormComponent },
      { path: 'reports', component: AdminReportsComponent },
    ]
  },
  { path: '**', redirectTo: 'home' }
];
