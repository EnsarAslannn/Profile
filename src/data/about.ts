// Owner-supplied Hakkımda copy, verbatim. Lives here rather than in Hero.tsx
// so it can be reused (HomePage derives the meta description from the first
// paragraph) without a component file exporting non-component values.
export type AboutParagraph = {
  id: string
  text: string
}

export const ABOUT_PARAGRAPHS: AboutParagraph[] = [
  {
    id: 'intro',
    text: 'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliğinin %100 İngilizce bölümünden mezun oldum. Ağırlıklı olarak C#, .NET ve React kullanarak projeler geliştiriyorum ve zamanla iyi bir Full Stack geliştirici olmayı amaçlıyorum.',
  },
  {
    id: 'focus',
    text: 'Özellikle son 6 aydır bu alana çok daha yoğun ve tempolu bir şekilde odaklanmış durumdayım. Bu süreçte hem yapay zekaya hızlıca adapte olmaya hem de onu iş akışımda en verimli şekilde kullanmaya gayret ediyorum. Geliştirdiğim projelerde arka planda nelerin olup bittiğini tam anlamıyla kavramak için kafa yoruyor ve yeni çıkan teknolojilerle rotamı sürekli güncel tutmaya çalışıyorum. Bu kısa ve yoğun süreçte elimden gelenin en iyisini yapmak için büyük bir çaba sarf ettim ve bundan sonraki kariyer yolculuğumda da aynı kararlılıkla çalışmaya devam edeceğim.',
  },
  {
    id: 'erasmus',
    text: 'Akademik ve kişisel gelişimimde Erasmus+ programının önemli bir yeri olduğunu düşünüyorum. Bu tecrübe bana tek başımayken karşılaştığım zorlukların üstesinden gelebilme yeteneği kazandırdı. Orada edindiğim samimi arkadaşlıklar ve yabancı dilde işlenen dersler, İngilizce iletişim becerilerime büyük bir katkı sağladı.',
  },
  {
    id: 'hobbies',
    text: 'Kalan vakitlerimde ise kişisel hobilerime odaklanmayı önemsiyorum. Futbol oynamak ve izlemek, arkadaşlarımla sosyalleşmek, dizi-film izlemek ve bilgisayar oyunları oynamak hobilerimin büyük kısmını kapsıyor.',
  },
  {
    id: 'goals',
    text: 'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.',
  },
]

