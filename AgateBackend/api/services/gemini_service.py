"""
Gemini AI Service for Campaign Banner Generation
"""
import os
import json
import base64

# Suppress deprecation warning and use google.genai
try:
    from google import genai
    from google.genai import types
    USE_NEW_SDK = True
    print("✅ google.genai SDK successfully imported")
except ImportError as e:
    print(f"❌ Failed to import google.genai: {e}")
    import google.generativeai as genai
    USE_NEW_SDK = False

from django.conf import settings


def get_gemini_client():
    """Gemini API client'ını oluştur"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    
    if USE_NEW_SDK:
        client = genai.Client(api_key=api_key)
        return client
    else:
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-2.5-flash')


def generate_advert_banner(advert_title: str, campaign_title: str, brand_name: str, 
                           description: str = "", style: str = "modern") -> dict:
    """
    Reklam afişi için Gemini Imagen API ile görsel oluştur
    
    Args:
        advert_title: Reklam başlığı
        campaign_title: Kampanya başlığı
        brand_name: Marka/şirket adı
        description: Reklam açıklaması
        style: Görsel stili (modern, minimal, bold, elegant, colorful)
    
    Returns:
        dict: {
            'image_base64': str,  # Base64 encoded görsel
            'image_url': str,     # Görsel URL (varsa)
            'prompt_used': str,   # Kullanılan prompt
            'success': bool
        }
    """
    try:
        client = get_gemini_client()
        
        # Stil açıklamaları
        style_descriptions = {
            'modern': 'clean, modern design with gradient backgrounds, sans-serif typography, minimalist layout',
            'minimal': 'ultra minimalist, lots of white space, simple geometric shapes, subtle colors',
            'bold': 'bold colors, large typography, high contrast, dynamic composition, eye-catching',
            'elegant': 'sophisticated, luxury feel, gold accents, serif fonts, refined textures',
            'colorful': 'vibrant colors, playful design, energetic mood, creative patterns'
        }
        
        style_desc = style_descriptions.get(style, style_descriptions['modern'])
        
        prompt = f"""Create a high-end, award-winning advertising poster for '{brand_name}'.
        
        Product/Service Context: {description if description else campaign_title}
        Headline: "{advert_title}"
        
        Visual Style: {style_desc}
        
        Art Direction:
        - Professional commercial photography
        - Cinematic lighting and composition
        - High resolution, 8k, highly detailed
        - Text should be legible and integrated into the design
        - The image must look like a real billboard or magazine ad
        - Sophisticated color grading
        
        Do not produce a cartoon or sketch. Produce a photorealistic advertisement."""

        if USE_NEW_SDK:
            try:
                # Imagen 4 ile görsel üretimi (Hızlı ve kaliteli)
                response = client.models.generate_images(
                    model='imagen-4.0-fast-generate-001',
                    prompt=prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        aspect_ratio='16:9',
                        output_mime_type='image/png'
                    )
                )
                
                if response.generated_images and len(response.generated_images) > 0:
                    image_data = response.generated_images[0].image.image_bytes
                    image_base64 = base64.b64encode(image_data).decode('utf-8')
                    
                    return {
                        'image_base64': image_base64,
                        'image_url': None,
                        'prompt_used': prompt,
                        'success': True,
                        'message': 'Reklam afişi başarıyla oluşturuldu (Imagen 4)'
                    }
                else:
                    return {
                        'image_base64': None,
                        'image_url': None,
                        'prompt_used': prompt,
                        'success': False,
                        'message': 'Görsel oluşturulamadı'
                    }
                    
            except Exception as imagen_error:
                # Imagen başarısız olursa, Gemini ile HTML banner oluştur
                error_msg = str(imagen_error)
                print(f"Imagen Error: {error_msg}") # Debug için logla
                
                # Fallback: HTML banner oluştur
                html_result = generate_campaign_banner(
                    campaign_title=f"{advert_title} - {campaign_title}",
                    brand_name=brand_name,
                    description=description,
                    style=style
                )
                
                if html_result['success']:
                    # HTML'i data URI olarak dön
                    return {
                        'image_base64': None,
                        'image_url': None,
                        'html_fallback': html_result['banner_html'],
                        'prompt_used': prompt,
                        'success': True,
                        'message': f'Imagen kullanılamadı ({error_msg}), HTML banner oluşturuldu'
                    }
                else:
                    return {
                        'image_base64': None,
                        'image_url': None,
                        'prompt_used': prompt,
                        'success': False,
                        'message': f'Hata: {error_msg}'
                    }
        else:
            # Eski SDK - sadece HTML banner
            html_result = generate_campaign_banner(
                campaign_title=f"{advert_title} - {campaign_title}",
                brand_name=brand_name,
                description=description,
                style=style
            )
            
            if html_result['success']:
                return {
                    'image_base64': None,
                    'image_url': None,
                    'html_fallback': html_result['banner_html'],
                    'prompt_used': html_result['prompt_used'],
                    'success': True,
                    'message': 'HTML banner oluşturuldu (eski SDK)'
                }
            else:
                return html_result
                
    except Exception as e:
        return {
            'image_base64': None,
            'image_url': None,
            'prompt_used': None,
            'success': False,
            'message': f'Hata: {str(e)}'
        }


def generate_campaign_banner(campaign_title: str, brand_name: str, description: str = "", style: str = "modern") -> dict:
    """
    Kampanya afişi için HTML/CSS tasarımı oluştur
    
    Args:
        campaign_title: Kampanya başlığı
        brand_name: Marka/şirket adı
        description: Kampanya açıklaması
        style: Tasarım stili (modern, minimal, bold, elegant)
    
    Returns:
        dict: {
            'banner_html': str,  # HTML/CSS kodu
            'prompt_used': str,  # Kullanılan prompt
            'color_scheme': list,  # Renk paleti
            'success': bool
        }
    """
    try:
        client = get_gemini_client()
        
        prompt = f"""
Sen bir profesyonel web tasarımcısısın. Aşağıdaki bilgilere göre bir kampanya afişi için HTML ve inline CSS kodu oluştur.

Kampanya Bilgileri:
- Kampanya Adı: {campaign_title}
- Marka/Şirket: {brand_name}
- Açıklama: {description if description else 'Genel kampanya'}
- İstenen Stil: {style}

Gereksinimler:
1. Tam çalışan HTML kodu oluştur (tek bir div içinde)
2. Inline CSS kullan (harici stylesheet yok)
3. Boyut: 728x90 piksel (leaderboard banner)
4. Görsel olarak çekici ve profesyonel olsun
5. Marka adı ve kampanya başlığı net görünsün
6. Gradient veya solid renkler kullan
7. Modern tipografi kullan (system fonts)
8. Hover efektleri ekleme (statik banner)

SADECE HTML kodunu döndür, açıklama ekleme. Kod ```html ile başlayıp ``` ile bitsin.
"""
        
        # SDK versiyonuna göre farklı çağrı
        if USE_NEW_SDK:
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt
            )
            banner_html = response.text
        else:
            response = client.generate_content(prompt)
            banner_html = response.text
        
        # HTML kodunu çıkar
        if "```html" in banner_html:
            banner_html = banner_html.split("```html")[1].split("```")[0].strip()
        elif "```" in banner_html:
            banner_html = banner_html.split("```")[1].split("```")[0].strip()
        
        return {
            'banner_html': banner_html,
            'prompt_used': prompt,
            'success': True,
            'message': 'Banner başarıyla oluşturuldu'
        }
        
    except Exception as e:
        return {
            'banner_html': None,
            'prompt_used': None,
            'success': False,
            'message': f'Hata: {str(e)}'
        }


def generate_banner_variations(campaign_title: str, brand_name: str, count: int = 3) -> list:
    """
    Birden fazla banner varyasyonu oluştur
    
    Args:
        campaign_title: Kampanya başlığı
        brand_name: Marka adı
        count: Varyasyon sayısı (max 5)
    
    Returns:
        list: Banner varyasyonları listesi
    """
    styles = ['modern', 'minimal', 'bold', 'elegant', 'colorful']
    variations = []
    
    for i in range(min(count, len(styles))):
        result = generate_campaign_banner(
            campaign_title=campaign_title,
            brand_name=brand_name,
            style=styles[i]
        )
        if result['success']:
            result['style'] = styles[i]
            variations.append(result)
    
    return variations


def generate_social_media_banners(campaign_title: str, brand_name: str, description: str = "") -> dict:
    """
    Farklı sosyal medya platformları için banner boyutları oluştur
    
    Returns:
        dict: Platform bazlı banner'lar
    """
    try:
        client = get_gemini_client()
        
        prompt = f"""
Aşağıdaki kampanya için farklı sosyal medya platformlarına uygun banner HTML kodları oluştur.

Kampanya: {campaign_title}
Marka: {brand_name}
Açıklama: {description if description else 'Genel kampanya'}

Her platform için ayrı bir div oluştur ve boyutları şöyle olsun:
1. Facebook Cover: 820x312 piksel
2. Instagram Post: 1080x1080 piksel (kare)
3. Twitter Header: 1500x500 piksel
4. LinkedIn Banner: 1584x396 piksel

Her birini ayrı HTML bloğu olarak ver. JSON formatında döndür:
{{
    "facebook": "<html kodu>",
    "instagram": "<html kodu>",
    "twitter": "<html kodu>",
    "linkedin": "<html kodu>"
}}

SADECE JSON döndür, başka bir şey ekleme.
"""
        
        # SDK versiyonuna göre farklı çağrı
        if USE_NEW_SDK:
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt
            )
            response_text = response.text
        else:
            response = client.generate_content(prompt)
            response_text = response.text
        
        # JSON'u parse et
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        banners = json.loads(response_text)
        
        return {
            'banners': banners,
            'success': True,
            'message': 'Sosyal medya banner\'ları oluşturuldu'
        }
        
    except Exception as e:
        return {
            'banners': None,
            'success': False,
            'message': f'Hata: {str(e)}'
        }
