import time
import os
from typing import List
from threading import Lock
from tool_helpers import fetch_all_tags, fetch_all_categories


class TagCategoryCache:
    """
    Cache for tags and categories to provide context to the LLM.

   (CURRENT SETUP - Periodic Refresh):
    To enable automatic cache refresh every N minutes:
    1. Change: cache = TagCategoryCache(ttl_seconds=300)  # 5 minutes
    2. That's it! The cache will auto-refresh when stale

    - ttl_seconds=0 disables auto-refresh
    - Loads tags/categories once on server startup
    - Requires server restart to see new tags/categories
    
    """
    
    def __init__(self, ttl_seconds=3000):
        """
        Initialize the cache.
        
        Args:
            ttl_seconds: Time to live in seconds. 0 = load once at startup,
                        >0 = auto-refresh when expired
        """
        self.tags: List[str] = []
        self.categories: List[str] = []
        self.last_updated: float = 0
        self.ttl: int = ttl_seconds  # 0 = load once, >0 = auto-refresh
        self.lock = Lock()
    
    def get_tags(self) -> List[str]:
        """Get cached tags, refreshing if TTL expired (when enabled)."""
        if self.ttl > 0 and time.time() - self.last_updated > self.ttl:
            self._refresh()
        return self.tags
    
    def get_categories(self) -> List[str]:
        """Get cached categories, refreshing if TTL expired (when enabled)."""
        if self.ttl > 0 and time.time() - self.last_updated > self.ttl:
            self._refresh()
        return self.categories
    
    def _refresh(self):
        """Fetch tags and categories from API."""
        with self.lock:
            # Double-check pattern to avoid race conditions
            if self.ttl > 0 and time.time() - self.last_updated <= self.ttl:
                return
            
            api_url = os.getenv("ACCOMPLISHMENT_API_URL", "")
            api_key = os.getenv("AGENT_API_KEY")

            if not api_url or not api_key:
                print("Warning: API configuration missing during cache refresh")
                return

            self.tags = fetch_all_tags(api_url, api_key)
            self.categories = fetch_all_categories(api_url, api_key)
            self.last_updated = time.time()
            print(f"Cache refreshed: {len(self.tags)} tags, {len(self.categories)} categories")
    
    def load_initial(self):
        """Load tags and categories on startup."""
        self._refresh()
