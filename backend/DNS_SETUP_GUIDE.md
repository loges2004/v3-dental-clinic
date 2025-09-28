# 🌐 DNS Setup Guide for V3 Dental Clinic Email

## 📋 **Step-by-Step DNS Configuration**

### **Step 1: Access Your Domain DNS Settings**

1. **Login to your domain registrar** (GoDaddy, Namecheap, Cloudflare, etc.)
2. **Find DNS Management** or **DNS Settings**
3. **Look for "DNS Records" or "Manage DNS"**

### **Step 2: Add Brevo DNS Records**

You need to add these **2 DNS records** to verify your domain with Brevo:

#### **Record 1: TXT Record (Domain Verification)**
```
Type: TXT
Name: brevo-code
Value: [Brevo will provide this - looks like: v=spf1 include:spf.brevo.com ~all]
TTL: 3600 (or default)
```

#### **Record 2: CNAME Record (Mail Server)**
```
Type: CNAME
Name: mail.v3dentalclinic.com
Value: mail.brevo.com
TTL: 3600 (or default)
```

### **Step 3: Add SPF Record (Optional but Recommended)**

Add this SPF record to prevent email spoofing:

```
Type: TXT
Name: @ (or leave blank for root domain)
Value: v=spf1 include:spf.brevo.com ~all
TTL: 3600
```

### **Step 4: Add DKIM Record (Optional but Recommended)**

Brevo will provide DKIM records. Add them as:

```
Type: TXT
Name: brevo._domainkey
Value: [Brevo will provide this]
TTL: 3600
```

## 🔍 **How to Find DNS Records in Brevo**

1. **Login to Brevo Dashboard:** [app.brevo.com](https://app.brevo.com)
2. **Go to:** Settings → Senders & IP → Senders
3. **Click:** "Add a sender" → "Domain"
4. **Enter:** `v3dentalclinic.com`
5. **Click:** "Add"
6. **Brevo will show you the exact DNS records to add**

## ⏱️ **Timeline**

- **DNS Propagation:** 1-24 hours
- **Brevo Verification:** 24-48 hours
- **Total Time:** Up to 48 hours

## 🧪 **How to Test DNS Records**

### **Test TXT Record:**
```bash
nslookup -type=TXT brevo-code.v3dentalclinic.com
```

### **Test CNAME Record:**
```bash
nslookup mail.v3dentalclinic.com
```

### **Test SPF Record:**
```bash
nslookup -type=TXT v3dentalclinic.com
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Domain not verified"**
- **Solution:** Wait 24-48 hours for DNS propagation
- **Check:** DNS records are exactly as Brevo provided

### **Issue 2: "CNAME record not found"**
- **Solution:** Make sure CNAME points to `mail.brevo.com` (not `smtp.brevo.com`)

### **Issue 3: "TXT record not found"**
- **Solution:** Check the exact value Brevo provided (no extra spaces)

## 📧 **After DNS Setup**

Once DNS is verified:

1. **Your emails will be sent from:** `noreply@v3dentalclinic.com`
2. **With sender name:** `V3 Dental Clinic`
3. **Through Brevo's servers** for better deliverability
4. **No more spam issues** or authentication warnings

## 🔧 **Alternative: Use Brevo's Default Domain**

If you can't set up custom domain:

1. **In Brevo dashboard:** Go to Settings → Senders & IP
2. **Use default sender:** `noreply@brevo.com`
3. **Update your code:** Change `spring.mail.from-address` to `noreply@brevo.com`

## 📞 **Need Help?**

- **Brevo Support:** [support.brevo.com](https://support.brevo.com)
- **DNS Help:** Contact your domain registrar
- **Check DNS:** [whatsmydns.net](https://www.whatsmydns.net)

---

**✅ Once DNS is verified, your email system will be fully professional and reliable!**
