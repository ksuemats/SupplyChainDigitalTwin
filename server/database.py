from neo4j import GraphDatabase
from typing import Optional

class Neo4jConnection:
    _instance: Optional['Neo4jConnection'] = None
    
    def __init__(self):
        self._driver = None
        
    @classmethod
    def get_instance(cls) -> 'Neo4jConnection':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def connect(self, uri: str, user: str, password: str):
        if not self._driver:
            self._driver = GraphDatabase.driver(uri, auth=(user, password))
            
    def close(self):
        if self._driver:
            self._driver.close()
            self._driver = None
            
    def get_session(self):
        return self._driver.session() if self._driver else None

# Example usage:
# db = Neo4jConnection.get_instance()
# db.connect("neo4j://localhost:7687", "neo4j", "password")
