"""Seed data endpoint for demo content"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.admin_user import AdminUser
from app.models.home_content import HomeContent
from app.models.story_section import StorySection
from app.models.story_image import StoryImage
from app.models.wedding_info_section import WeddingInfoSection
from app.models.timeline_event import TimelineEvent
from app.models.gallery_image import GalleryImage
from app.models.gift_item import GiftItem

router = APIRouter(prefix="/api/seed", tags=["seed"])


@router.post("/demo")
def seed_demo_data(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Seed database with demo content"""
    try:
        # 1. Home Content
        home_content = db.query(HomeContent).first()
        if not home_content:
            home_content = HomeContent(
                hero_text="Bianca & Joel",
                subtitle="Join us for our special day",
                wedding_date=date(2025, 6, 15),
                hero_image_url="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            )
            db.add(home_content)
        else:
            home_content.hero_text = "Bianca & Joel"
            home_content.subtitle = "Join us for our special day"
            home_content.wedding_date = date(2025, 6, 15)
            home_content.hero_image_url = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"

        # 2. Story Sections
        story_sections_data = [
            {
                "title": "Como nos conhecemos",
                "content": "Nos conhecemos em uma bela tarde de primavera, quando o destino nos uniu em um café aconchegante. Desde o primeiro olhar, soubemos que algo especial estava começando.",
                "order": 0
            },
            {
                "title": "O pedido",
                "content": "Em uma noite estrelada, sob o céu mais lindo que já vimos, Joel se ajoelhou e pediu minha mão em casamento. Foi o momento mais mágico das nossas vidas.",
                "order": 1
            },
            {
                "title": "Nossa jornada",
                "content": "Juntos, construímos sonhos, compartilhamos risos e superamos desafios. Cada dia ao seu lado é uma nova aventura, e não podemos esperar para começar esta nova fase juntos.",
                "order": 2
            }
        ]
        
        for section_data in story_sections_data:
            existing = db.query(StorySection).filter(
                StorySection.title == section_data["title"]
            ).first()
            if not existing:
                db.add(StorySection(**section_data))

        # 3. Story Images
        story_images_data = [
            {
                "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
                "caption": "Nosso primeiro encontro",
                "order": 0
            },
            {
                "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
                "caption": "Momentos especiais",
                "order": 1
            },
            {
                "image_url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
                "caption": "Aventuras juntos",
                "order": 2
            }
        ]
        
        for img_data in story_images_data:
            existing = db.query(StoryImage).filter(
                StoryImage.image_url == img_data["image_url"]
            ).first()
            if not existing:
                db.add(StoryImage(**img_data))

        # 4. Wedding Info Sections
        info_sections_data = [
            {
                "title": "Cerimônia",
                "description": "Nossa cerimônia será realizada em uma capela histórica, cercada pela natureza. Será um momento íntimo e especial para celebrar nosso amor.",
                "icon": "rings",
                "section_type": "ceremony",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1973534208!2d-46.633331!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjkiUyA0NsKwMzcnNTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
            },
            {
                "title": "Recepção",
                "description": "Após a cerimônia, vamos celebrar com música, dança e muita alegria! A recepção será em um salão elegante com vista para os jardins.",
                "icon": "champagne",
                "section_type": "reception",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1973534208!2d-46.633331!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjkiUyA0NsKwMzcnNTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
            },
            {
                "title": "Dress Code",
                "description": "Pedimos que nossos convidados venham elegantemente vestidos. Cores suaves e tons pastéis são bem-vindos!",
                "icon": "dress",
                "section_type": "dress_code"
            },
            {
                "title": "Estacionamento",
                "description": "Há estacionamento disponível no local. Por favor, chegue com alguns minutos de antecedência.",
                "icon": "car",
                "section_type": "parking"
            },
            {
                "title": "Hospedagem",
                "description": "Para convidados de fora da cidade, recomendamos os seguintes hotéis próximos ao local do evento.",
                "icon": "hotel",
                "section_type": "hotel"
            }
        ]
        
        for info_data in info_sections_data:
            existing = db.query(WeddingInfoSection).filter(
                WeddingInfoSection.section_type == info_data["section_type"]
            ).first()
            if not existing:
                db.add(WeddingInfoSection(**info_data))

        # 5. Timeline Events
        timeline_events_data = [
            {
                "time": time(15, 0),
                "title": "Cerimônia",
                "description": "Cerimônia de casamento na capela",
                "icon": "rings",
                "order": 0
            },
            {
                "time": time(16, 0),
                "title": "Cocktail",
                "description": "Cocktail de boas-vindas com aperitivos",
                "icon": "cocktail",
                "order": 1
            },
            {
                "time": time(17, 30),
                "title": "Jantar",
                "description": "Jantar servido no salão principal",
                "icon": "dinner",
                "order": 2
            },
            {
                "time": time(19, 0),
                "title": "Bolo e Brinde",
                "description": "Corte do bolo e brinde aos noivos",
                "icon": "cake",
                "order": 3
            },
            {
                "time": time(20, 0),
                "title": "Festa",
                "description": "Pista de dança aberta! Vamos celebrar até tarde!",
                "icon": "music",
                "order": 4
            }
        ]
        
        for event_data in timeline_events_data:
            existing = db.query(TimelineEvent).filter(
                TimelineEvent.title == event_data["title"],
                TimelineEvent.time == event_data["time"]
            ).first()
            if not existing:
                db.add(TimelineEvent(**event_data))

        # 6. Gallery Images
        gallery_images_data = [
            {
                "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
                "caption": "Ensaio fotográfico - Look 1",
                "order": 0
            },
            {
                "image_url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
                "caption": "Ensaio fotográfico - Look 2",
                "order": 1
            },
            {
                "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
                "caption": "Ensaio fotográfico - Look 3",
                "order": 2
            },
            {
                "image_url": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
                "caption": "Preparativos",
                "order": 3
            },
            {
                "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
                "caption": "Momentos especiais",
                "order": 4
            },
            {
                "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
                "caption": "Celebração",
                "order": 5
            }
        ]
        
        for img_data in gallery_images_data:
            existing = db.query(GalleryImage).filter(
                GalleryImage.image_url == img_data["image_url"]
            ).first()
            if not existing:
                db.add(GalleryImage(**img_data))

        # 7. Gift Items
        gift_items_data = [
            {
                "title": "Lista de Presentes - Magazine Luiza",
                "description": "Acesse nossa lista de presentes na Magazine Luiza",
                "link": "https://www.magazineluiza.com.br",
                "image_url": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
                "item_type": "external",
                "order": 0
            },
            {
                "title": "Lista de Presentes - Amazon",
                "description": "Confira nossa lista de presentes na Amazon",
                "link": "https://www.amazon.com.br",
                "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
                "item_type": "external",
                "order": 1
            },
            {
                "title": "Pix para Lua de Mel",
                "description": "Ajude-nos a realizar nossa lua de mel dos sonhos",
                "link": "",
                "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
                "item_type": "card",
                "order": 2
            },
            {
                "title": "Pix para Casa Nova",
                "description": "Contribua para nossa nova casa",
                "link": "",
                "image_url": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
                "item_type": "card",
                "order": 3
            }
        ]
        
        for gift_data in gift_items_data:
            existing = db.query(GiftItem).filter(
                GiftItem.title == gift_data["title"]
            ).first()
            if not existing:
                db.add(GiftItem(**gift_data))

        db.commit()
        
        return {
            "message": "Dados de exemplo adicionados com sucesso!",
            "added": {
                "home_content": 1,
                "story_sections": len(story_sections_data),
                "story_images": len(story_images_data),
                "info_sections": len(info_sections_data),
                "timeline_events": len(timeline_events_data),
                "gallery_images": len(gallery_images_data),
                "gift_items": len(gift_items_data)
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao adicionar dados de exemplo: {str(e)}")


@router.delete("/demo")
def clear_demo_data(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Clear all demo content (except admin users)"""
    try:
        # Confirmar ação
        deleted_count = 0
        
        # Delete gallery images
        deleted_count += db.query(GalleryImage).delete()
        
        # Delete gift items
        deleted_count += db.query(GiftItem).delete()
        
        # Delete timeline events
        deleted_count += db.query(TimelineEvent).delete()
        
        # Delete story images
        deleted_count += db.query(StoryImage).delete()
        
        # Delete story sections
        deleted_count += db.query(StorySection).delete()
        
        # Delete info sections
        deleted_count += db.query(WeddingInfoSection).delete()
        
        # Reset home content (but don't delete)
        home_content = db.query(HomeContent).first()
        if home_content:
            home_content.hero_text = "Bianca & Joel"
            home_content.subtitle = "Join us for our special day"
            home_content.wedding_date = None
            home_content.hero_image_url = None
        
        db.commit()
        
        return {
            "message": "Conteúdo de exemplo removido com sucesso!",
            "deleted_items": deleted_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao remover dados de exemplo: {str(e)}")

