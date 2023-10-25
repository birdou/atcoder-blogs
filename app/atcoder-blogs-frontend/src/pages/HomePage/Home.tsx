import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    return (
        <AtCoderBlogsIntro/>
    )
}

const AtCoderBlogsIntro: React.FC = () => {
    const navigate = useNavigate();
    const handleGoToBlogsClicked = () => {
        navigate('/blogs');
    }

    return (
        <div className="atcoder-blogs-intro" style={{ marginBottom: '50px' }}>
            <h1 style={{ marginTop: '25px' }}>AtCoder Blogsとは</h1>
                AtCoderBlogsは、思考整理をする精進の量を可視化して精進を支援するためのサイトです。<br/>
                ブログのリンクを記録することで、思考整理をする精進の量を可視化することができます。<br/>
                <div className='horizontal-center-align'>
                    <img src='/usage/atcoder-blogs-table-sample.jpg' width='75%' style={{ marginTop: '10px'}}></img>
                </div>
            <h1>AtCoder Blogsを作るに至った想い</h1>

            <div>
                AtCoderで強くなるためにどんな精進をすればいいかは多くの人の悩みだと思います。私は以下の2種類の精進があると考えています。<br/>
            </div>

            <div>
                <ol>
                    <li>
                    問題を多く解く精進
                    <ul>
                        問題を多く解く行為。この精進ができている人は、似たような問題にであったときのパターンを見抜いて、
                        パターンマッチングで解くのが上手なイメージです。 (主観です。)
                    </ul>
                    </li>
                    <li>
                    思考整理をする精進
                    <ul>
                        解説ACした問題や解くのに時間がかかった問題を題材に、なぜ解けなかったのか、
                        どうすれば次に解けるようになるのかについて思考整理をする行為。暖色系の方々がやった方が大事だとよく言っているイメージです。 (主観です。)
                    </ul>
                    </li>
                </ol>
            </div>
            <div>
                問題を多く解いて精進するのは、AtCoderProblemsという神様サイトのおかげで積み重ねてきた量が可視化されており、みなさん楽しんでできていると思います。
                そこで、思考整理をする精進をAtCoderProblesのように支援してくれるサイトが欲しいという想いでこのサイトを作成しました。<br/>
            </div>

            <h1>利用方法</h1>
                <ol>
                    <li><a href="/blogs">このリンク</a>または左上のロゴをクリックしてブログ記録ページに移動します。</li>
                    <li>右上のボタンからGitHubアカウントでログインしてください(下図ではこの部分は省略)</li>
                    <li>自分のブログをクリックします</li>
                    <li>ブログ一括編集ボタンをクリックします</li>
                    <li>ブログのURLを貼り付けます</li>
                        思考整理をした解説ブログを書いた際にそのブログのURLを貼り付けてください。<br/>
                        利用するブログサイトは、自由に選択して頂いて構いません。<br/>
                        ブログの内容を公開したくない場合は、非公開リンクを貼り付けて頂いてOKです。<br/>
                        ただし、AtCoderと関係のないリンクの貼り付けは禁止しています。ご了承ください。<br/>
                    <li>ブログ一括編集終了ボタンをクリックします</li>
                    <li>ブログのURLが有効になっていることを確認します</li>
                </ol>
            <div className="horizontal-center-align">
                <img src="/usage/atcoder-blogs-usage-add-blog.gif" width="75%" alt='usage: add blog'></img>
                <button type="button" className="blue-button" onClick={handleGoToBlogsClicked} style={{ marginTop: '50px' }}>
                    サイトを使ってみる
                </button>
            </div>

            <h1>GitHubリポジトリ</h1>
            <a href='https://github.com/birdou/atcoder-blogs'>https://github.com/birdou/atcoder-blogs</a>
        </div>
    );
  };
  