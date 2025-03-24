from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from flask_cors import CORS
from index import query_knowledge_base
from saveEmbed import main as save_embeddings
import logging

# 初始化Flask应用
app = Flask(__name__)
# 启用CORS支持
CORS(app, resources={
    r"/chat": {
        "origins": "*",
        "methods": ["OPTIONS", "POST"],
        "allow_headers": ["Content-Type", "Authorization", "x-request-id", "token"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 600
    }
})

api = Api(app, version='1.0', title='Knowledge Base API',
          description='API for querying knowledge base and saving embeddings')

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 定义请求模型
query_model = api.model('Query', {
    'query': fields.String(required=True, description='User query')
})

embed_model = api.model('Document', {
    'id': fields.String(required=True),
    'content': fields.String(required=True),
    'source': fields.String(required=True)
})

@api.route('/chat')
class Query(Resource):
    def options(self):
        """Handle CORS preflight"""
        return {'status': 'ok'}, 200

    @api.expect(query_model)
    def post(self):
        """Query knowledge base"""
        try:
            data = request.json
            query = data.get('query')
            if not query:
                return {'error': 'Query parameter is required'}, 400
                
            response = query_knowledge_base(query)
            return {'response': response}
            
        except Exception as e:
            logger.error(f"Query error: {str(e)}")
            return {'error': str(e)}, 500

@api.route('/embed')
class Embed(Resource):
    @api.expect(embed_model)
    def post(self):
        """Save documents to ChromaDB"""
        try:
            data = request.json
            if not isinstance(data, list):
                return {'error': 'Request body must be an array of documents'}, 400
                
            # 调用保存逻辑
            save_embeddings(data)
            return {'status': 'success'}
            
        except Exception as e:
            logger.error(f"Embed error: {str(e)}")
            return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
