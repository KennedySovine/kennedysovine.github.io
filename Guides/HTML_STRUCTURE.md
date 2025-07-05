# HTML Structure: Building Your Website's Foundation

**Learning HTML for Complete Beginners**

This guide will teach you how HTML works in your portfolio, explained in simple terms. Think of HTML as the skeleton of your website - it gives everything structure and meaning.

## 🤔 What is HTML?

**HTML = HyperText Markup Language**

**Simple Translation:** HTML is the language that tells web browsers how to structure and display content.

**Real-World Analogy:**
- **HTML** is like the frame of a house - it decides where the rooms go
- **CSS** is like the paint and decorating - it makes everything look pretty  
- **JavaScript** is like the electrical system - it makes things interactive

### 🏠 The Basic HTML Document Structure

Every HTML page follows the same basic pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Information ABOUT the page (invisible to visitors) -->
  <title>Page Title</title>
  <meta charset="UTF-8">
</head>
<body>
  <!-- Content visitors actually see -->
  <h1>Welcome to my website!</h1>
  <p>This is a paragraph of text.</p>
</body>
</html>
```

**What Each Part Does:**
- `<!DOCTYPE html>` = "Hey browser, this is modern HTML!"
- `<html>` = The container for everything
- `<head>` = Information about the page (like the index of a book)
- `<body>` = What visitors actually see and read

## 🧱 Understanding HTML Elements

**What is an "Element"?**
An element is like a building block. Each one has a specific purpose.

### 📝 Common Elements You'll See:

```html
<h1>This is a big heading</h1>
<h2>This is a smaller heading</h2>
<p>This is a paragraph of regular text.</p>
<a href="https://google.com">This is a link</a>
<img src="photo.jpg" alt="Description of photo">
<div>This is a container for other elements</div>
```

**Real-World Analogy:**
- `<h1>` = Chapter title in a book
- `<h2>` = Section title in a book
- `<p>` = Paragraph in a book
- `<a>` = Reference or footnote that takes you somewhere else
- `<img>` = Picture in a book
- `<div>` = Box to organize related content

## 🎯 Semantic HTML (Using the Right Element for the Job)

**What Does "Semantic" Mean?**
It means using HTML elements that describe what the content IS, not what it looks like.

**Good Example (Semantic):**
```html
<article>
  <header>
    <h1>My Blog Post</h1>
    <time>January 15, 2024</time>
  </header>
  <p>This is the content of my blog post...</p>
  <footer>
    <p>Written by John Doe</p>
  </footer>
</article>
```

**Bad Example (Not Semantic):**
```html
<div>
  <div class="big-text">My Blog Post</div>
  <div class="small-text">January 15, 2024</div>
  <div>This is the content of my blog post...</div>
  <div class="author">Written by John Doe</div>
</div>
```

**Why Semantic HTML is Better:**
- **Screen readers** can understand your content better
- **Search engines** know what's important
- **Other developers** can read your code easier
- **Your future self** will thank you!

## 📖 The `<head>` Section: Information About Your Page

**What is the `<head>` Section?**
It's like the cover and first few pages of a book - it contains information ABOUT your website, but visitors don't see it directly.

### 🔤 Essential Meta Tags (The Important Invisible Stuff)

**Your portfolio's `<head>` section contains these important tags:**

```html
<head>
  <!-- Tell the browser what type of text this is -->
  <meta charset="UTF-8">
  
  <!-- Make the site work well on phones -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- The title that shows in browser tabs -->
  <title>Kennedy's Portfolio - Web Developer & Designer</title>
  
  <!-- Description for search engines -->
  <meta name="description" content="Portfolio showcasing web development projects">
  
  <!-- Connect the CSS file to make it look good -->
  <link rel="stylesheet" href="css/style.css">
</head>
```

**What Each One Does:**

### 🔤 `charset="UTF-8"`
**What it does:** Tells the browser how to read text characters
**Why it matters:** Without this, special characters (like é, ñ, 中) might look weird
**Real-world analogy:** Like telling someone "this letter is written in English"

### 📱 `viewport` Tag
**What it does:** Makes your site work well on phones and tablets
**Why it matters:** Without this, your site would look tiny on phones
**Real-world analogy:** Like adjusting a telescope for different eyes

### 🏷️ `<title>` Tag
**What it does:** Sets the text that appears in browser tabs
**Why it matters:** This is what people see when they bookmark your site
**Example:** When you have multiple tabs open, this is what you read to find the right one

### 📝 `description` Meta Tag
**What it does:** Tells search engines what your page is about
**Why it matters:** This text might show up in Google search results
**Real-world analogy:** Like the description on the back of a book

### 📚 Social Media Tags (Making Links Look Good)

**When someone shares your portfolio on Facebook or Twitter, these tags control how it looks:**

```html
<!-- Facebook/social media preview -->
<meta property="og:title" content="Kennedy's Portfolio">
<meta property="og:description" content="Check out my web development work">
<meta property="og:image" content="/images/portfolio-preview.jpg">

<!-- Twitter preview -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Kennedy's Portfolio">
<meta name="twitter:description" content="Check out my web development work">
```

**What This Does:**
Instead of just showing a plain link, social media will show:
- Your portfolio title
- A description
- A preview image
- A nice-looking card

## 🏗️ Your Portfolio's HTML Structure

**What is "Document Structure"?**
It's how you organize the content on your page, like chapters in a book.

### 📄 Your Main Portfolio Page (`index.html`)

**Think of your portfolio like a magazine article:**

```html
<body>
  <!-- The header (like magazine title) -->
  <header>
    <nav>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- The main content (like the article body) -->
  <main>
    <!-- Hero section (like the magazine cover story) -->
    <section id="hero">
      <h1>Your Name</h1>
      <p>Web Developer & Designer</p>
    </section>

    <!-- About section (like an interview) -->
    <section id="about">
      <h2>About Me</h2>
      <p>Tell people about yourself...</p>
    </section>

    <!-- Portfolio section (like a photo gallery) -->
    <section id="portfolio">
      <h2>My Work</h2>
      <div class="project-grid">
        <article class="project-card">
          <h3>Cool Project</h3>
          <p>Description of what you built...</p>
        </article>
      </div>
    </section>
  </main>

  <!-- The footer (like magazine credits) -->
  <footer>
    <p>&copy; 2024 Your Name. All rights reserved.</p>
  </footer>
</body>
```

### 🖼️ Your Gallery Page (`gallery.html`)

**Think of your gallery like a museum:**

```html
<body>
  <div class="gallery-container">
    <!-- Museum entrance (header) -->
    <header class="gallery-header">
      <nav class="breadcrumb">
        <a href="index.html">Portfolio</a> → Art Gallery
      </nav>
      <h1>My Art Gallery</h1>
    </header>

    <div class="gallery-main">
      <!-- Information desk (sidebar with search) -->
      <aside class="gallery-sidebar">
        <h2>Search & Filter</h2>
        
        <!-- Search box -->
        <div class="search-box">
          <input type="text" placeholder="Search artwork...">
        </div>

        <!-- Filter buttons (like museum sections) -->
        <div class="filter-group">
          <h3>Filter by Type</h3>
          <label>
            <input type="checkbox" value="all" checked>
            All Types
          </label>
          <label>
            <input type="checkbox" value="digital">
            Digital Art
          </label>
          <!-- More filters... -->
        </div>
      </aside>

      <!-- Exhibition hall (main gallery) -->
      <main class="gallery-content">
        <!-- Gallery grid (like artwork on walls) -->
        <div class="gallery-grid">
          <!-- Each artwork becomes a card here -->
        </div>
      </main>
    </div>
  </div>
</body>
```

### 🎯 Key HTML Elements Explained

**What Each Element Does:**

#### 📍 `<header>` 
**Purpose:** Contains site navigation and page title
**Real-world:** Like the entrance sign to a building

#### 📍 `<nav>`
**Purpose:** Contains navigation links
**Real-world:** Like a menu at a restaurant

#### 📍 `<main>`
**Purpose:** The primary content of the page
**Real-world:** Like the main article in a newspaper

#### 📍 `<section>`
**Purpose:** A distinct section of content
**Real-world:** Like chapters in a book

#### 📍 `<article>`
**Purpose:** Self-contained content (like a blog post or project)
**Real-world:** Like individual articles in a magazine

#### 📍 `<aside>`
**Purpose:** Content that's related but separate (like a sidebar)
**Real-world:** Like a sidebar in a magazine

#### 📍 `<footer>`
**Purpose:** Footer information (copyright, links)
**Real-world:** Like the credits at the end of a movie

## ♿ Making Your HTML Accessible

**What is "Accessibility"?**
Making sure your website works for everyone, including people who use screen readers or have disabilities.

### 🏷️ Using Proper Labels

**Good Example:**
```html
<label for="search-input">Search artwork:</label>
<input type="text" id="search-input" placeholder="Type here...">
```

**Why This Helps:**
- **Screen readers** know what the input is for
- **Clicking the label** focuses the input
- **Clear purpose** for everyone

### 🎯 Using Alt Text for Images

**Good Example:**
```html
<img src="my-painting.jpg" alt="Abstract painting with blue and red swirls">
```

**Bad Example:**
```html
<img src="my-painting.jpg" alt="image">
```

**Why Alt Text Matters:**
- **Screen readers** describe images to blind users
- **Shows text** if image fails to load
- **Search engines** understand your images better

### 🎯 Proper Heading Structure

**Good Example (Logical Order):**
```html
<h1>My Portfolio</h1>
  <h2>About Me</h2>
  <h2>My Projects</h2>
    <h3>Web Development</h3>
    <h3>Design Work</h3>
  <h2>Contact</h2>
```

**Bad Example (Skipping Levels):**
```html
<h1>My Portfolio</h1>
  <h3>About Me</h3>  <!-- Skipped h2! -->
  <h2>My Projects</h2>
    <h5>Web Development</h5>  <!-- Skipped h3 and h4! -->
```

## 📱 Making Your HTML Work on Phones

**What is "Mobile-First"?**
Building your website to work well on phones first, then making it work on bigger screens.

### 📱 The Viewport Tag (Super Important!)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**What this does:**
- **width=device-width:** "Make the website as wide as the phone screen"
- **initial-scale=1.0:** "Don't zoom in or out when the page loads"

**Without this tag:** Your website would look tiny on phones (like a desktop website shrunk down)
**With this tag:** Your website fits nicely on phone screens

### 👆 Touch-Friendly Elements

**Good Example (Easy to Tap):**
```html
<button style="min-height: 44px; min-width: 44px;">
  Click me
</button>
```

**Why 44px?**
- Apple recommends minimum 44px for touch targets
- Easier for people with big fingers to tap
- Reduces accidental taps on wrong buttons

## 🔍 Search Engine Optimization (SEO) Basics

**What is SEO?**
Making your website easy for search engines (like Google) to find and understand.

### 📝 Writing Good Titles and Descriptions

**Good Title:**
```html
<title>Kennedy Sovine - Web Developer & UI Designer | Portfolio</title>
```

**Good Description:**
```html
<meta name="description" content="Web developer specializing in JavaScript and modern UI design. View my portfolio of creative projects.">
```

**Why These Help:**
- **Clear titles** help people find your site in search results
- **Good descriptions** make people want to click your link
- **Specific keywords** help search engines understand your content

### 🔗 Making Links Shareable

**When someone shares your portfolio on social media:**
```html
<!-- These tags control how the link looks -->
<meta property="og:title" content="Kennedy's Portfolio">
<meta property="og:description" content="Check out my web development work">
<meta property="og:image" content="/images/portfolio-preview.jpg">
```

**Result:** Instead of a plain link, social media shows a nice preview card with your title, description, and image!

## 🎯 What You've Learned About HTML

**Congratulations!** You now understand:

### 🏗️ HTML Structure
- **HTML is the skeleton** of your website
- **Elements** are building blocks with specific purposes
- **Semantic HTML** uses the right element for the job
- **Structure matters** for both users and search engines

### 📱 Accessibility & Mobile
- **Alt text** helps screen readers describe images
- **Proper labels** make forms usable for everyone
- **Viewport tag** makes sites work on phones
- **Heading order** creates logical document flow

### 🔍 SEO Basics
- **Good titles** help people find your site
- **Meta descriptions** encourage clicks
- **Social media tags** make links shareable
- **Clean structure** helps search engines understand content

## 🚀 Next Steps

**Now that you understand HTML:**
1. **Look at your portfolio's HTML files** - you'll recognize the patterns!
2. **Try making small changes** - maybe update the title or description
3. **Check your site on different devices** - see how the viewport tag works
4. **Read the CSS guide next** - learn how to make HTML look beautiful

**Remember:**
- **HTML is forgiving** - small mistakes usually don't break everything
- **Practice makes perfect** - the more you work with HTML, the easier it gets
- **Semantic HTML is your friend** - use the right elements and everything else gets easier

---

**You now have a solid foundation in HTML!** The other guides will build on this knowledge to teach you CSS styling, JavaScript interactivity, and more advanced topics. Great job! 🎉
