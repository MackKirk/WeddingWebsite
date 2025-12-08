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
                "title": "How We Met",
                "content": "We met on a beautiful spring afternoon in Pitt Meadows, when fate brought us together at a cozy café. From the first glance, we knew something special was beginning.",
                "order": 0
            },
            {
                "title": "The Proposal",
                "content": "On a starry night, under the most beautiful sky we had ever seen, Joel got down on one knee and asked for my hand in marriage. It was the most magical moment of our lives.",
                "order": 1
            },
            {
                "title": "Our Journey",
                "content": "Together, we've built dreams, shared laughter, and overcome challenges. Every day by your side is a new adventure, and we can't wait to start this new chapter together in Pitt Meadows, Canada.",
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
                "caption": "Our first date",
                "order": 0
            },
            {
                "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
                "caption": "Special moments",
                "order": 1
            },
            {
                "image_url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
                "caption": "Adventures together",
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
                "title": "Ceremony",
                "description": "Our ceremony will be held at a historic chapel in Pitt Meadows, surrounded by nature. It will be an intimate and special moment to celebrate our love.",
                "icon": "rings",
                "section_type": "ceremony",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.5!2d-122.689722!3d49.221389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548675b8b8b8b8b8%3A0x1234567890abcdef!2sPitt%20Meadows%2C%20BC%2C%20Canada!5e0!3m2!1sen!2sca!4v1234567890"
            },
            {
                "title": "Reception",
                "description": "After the ceremony, we'll celebrate with music, dancing, and lots of joy! The reception will be held in an elegant hall with garden views in Pitt Meadows.",
                "icon": "champagne",
                "section_type": "reception",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.5!2d-122.689722!3d49.221389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548675b8b8b8b8b8%3A0x1234567890abcdef!2sPitt%20Meadows%2C%20BC%2C%20Canada!5e0!3m2!1sen!2sca!4v1234567890"
            },
            {
                "title": "Dress Code",
                "description": "We kindly ask our guests to dress elegantly. Soft colors and pastel tones are welcome!",
                "icon": "dress",
                "section_type": "dress_code"
            },
            {
                "title": "Parking",
                "description": "Parking is available on-site. Please arrive a few minutes early.",
                "icon": "car",
                "section_type": "parking"
            },
            {
                "title": "Accommodation",
                "description": "For out-of-town guests, we recommend the following hotels near the event venue.",
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
                "title": "Ceremony",
                "description": "Wedding ceremony at the chapel",
                "icon": "rings",
                "order": 0
            },
            {
                "time": time(16, 0),
                "title": "Cocktail Hour",
                "description": "Welcome cocktail with appetizers",
                "icon": "cocktail",
                "order": 1
            },
            {
                "time": time(17, 30),
                "title": "Dinner",
                "description": "Dinner served in the main hall",
                "icon": "dinner",
                "order": 2
            },
            {
                "time": time(19, 0),
                "title": "Cake & Toast",
                "description": "Cake cutting and toast to the newlyweds",
                "icon": "cake",
                "order": 3
            },
            {
                "time": time(20, 0),
                "title": "Reception Party",
                "description": "Dance floor is open! Let's celebrate until late!",
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
                "caption": "Engagement photoshoot - Look 1",
                "order": 0
            },
            {
                "image_url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
                "caption": "Engagement photoshoot - Look 2",
                "order": 1
            },
            {
                "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
                "caption": "Engagement photoshoot - Look 3",
                "order": 2
            },
            {
                "image_url": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
                "caption": "Preparations",
                "order": 3
            },
            {
                "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
                "caption": "Special moments",
                "order": 4
            },
            {
                "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
                "caption": "Celebration",
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
                "title": "Wedding Registry - The Bay",
                "description": "Check out our wedding registry at The Bay",
                "link": "https://www.thebay.com",
                "image_url": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
                "item_type": "external",
                "order": 0
            },
            {
                "title": "Wedding Registry - Amazon",
                "description": "Browse our wedding registry on Amazon",
                "link": "https://www.amazon.ca",
                "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
                "item_type": "external",
                "order": 1
            },
            {
                "title": "Honeymoon Fund",
                "description": "Help us make our dream honeymoon come true",
                "link": "",
                "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
                "item_type": "card",
                "order": 2
            },
            {
                "title": "New Home Fund",
                "description": "Contribute to our new home",
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
            "message": "Demo content added successfully!",
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
        raise HTTPException(status_code=500, detail=f"Error adding demo content: {str(e)}")


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
            "message": "Demo content removed successfully!",
            "deleted_items": deleted_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error removing demo content: {str(e)}")

