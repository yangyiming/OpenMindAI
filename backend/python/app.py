from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields, Namespace
from flask_cors import CORS

# 定义统一响应模型
response_model = {
    'code': fields.String(default='0', description='0-成功 1-失败'),
    'msg': fields.String(default='成功', description='响应消息'),
    'data': fields.Raw(description='响应数据')
}

def make_response(code='0', msg='成功', data=None):
    """统一响应格式"""
    return {
        'code': code,
        'msg': msg,
        'data': data
    }, 200 if code == '0' else 400
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
        return make_response(data={'status': 'ok'})

    @api.expect(query_model)
    @api.marshal_with(response_model)
    def post(self):
        """Query knowledge base"""
        try:
            data = request.json
            query = data.get('query')
            if not query:
                return make_response(code='1', msg='Query parameter is required')
                
            response = query_knowledge_base(query)
            return make_response(data={'response': response})
            
        except Exception as e:
            logger.error(f"Query error: {str(e)}")
            return make_response(code='1', msg=str(e))

@api.route('/embed')
class Embed(Resource):
    @api.expect(embed_model)
    @api.marshal_with(response_model)
    def post(self):
        """Save documents to ChromaDB"""
        try:
            data = request.json
            if not isinstance(data, list):
                return make_response(code='1', msg='Request body must be an array of documents')
                
            # 调用保存逻辑
            save_embeddings(data)
            return make_response(data={'status': 'success'})
            
        except Exception as e:
            logger.error(f"Embed error: {str(e)}")
            return make_response(code='1', msg=str(e))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6602, debug=True)
